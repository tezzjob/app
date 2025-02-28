import z from 'zod'
import { SignUpReq } from '../utils/req.zod'
import prisma from '../prisma/prisma'
import {ApiError} from '../middlewares/errors'
import httpStatus from 'http-status'
import logger from '../utils/logger'
import { sendEmail } from '../mailer/sendMail'
import { Employee, EmployeeShopMapping, Prisma, Shop } from '@prisma/client'
import { APP_URL } from '../utils/config'
import { Api } from '@mui/icons-material'

export const createEmployee = async (employeeData: z.infer<typeof SignUpReq>) => {

    let employee:Employee | null = null;
    //transaction: if something fails then it will abort all operation including previously created or updated records
    await prisma.$transaction(async (prisma) => {
        logger.info('Received request to create an employee');

        //data from req
        const { name, email, locality, mobile } = employeeData;

        let existing = await prisma.employee.findUnique({ where: { email } });

        if (existing) {
          throw new ApiError(
            httpStatus.UNPROCESSABLE_ENTITY,
            'Email is already registered with Tezzjob'
          );
        }

        existing = await prisma.employee.findUnique({ where: { mobile } });

        if (existing) {
          throw new ApiError(
            httpStatus.UNPROCESSABLE_ENTITY,
            'Mobile is already registered with Tezzjob'
          );
        }

        //create employee in db
        employee = await prisma.employee.create({
          data: {
            name,
            email,
            mobile,
            locality,
          },
        });

        //if matching shops then only send email or create employee 
        const matchingShops = await setEmployeeRelavantJobs(prisma, employee);

        //if this condition fails employee will not be created in db
        if (matchingShops.length === 0)
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `No Matching jobs found for preferred locations!`
          );
    })

    //if employee is created then send email
    if(employee)
        await sendEmailWrapper(employee);

}


const sendEmailWrapper = async (employee: Employee) => {
  const employeeShopMappings = await prisma.employeeShopMapping.findMany({
    where: {
      employeeId: employee.id,
    },
    include: {
      shop: {
        select: {
          shopName: true,
          ownerName: true,
          shopLocation: true,
          ownerEmail: true,
          ownerMobile: true,
          jobPostings: {
            select: {
              id: true,
              jobTitle: true,
              salaryPerMonth: true,
              timingFrom: true,
              timingTo: true,
            },
          },
        },
      },
    },
  });

  console.log(employeeShopMappings);

  if (employeeShopMappings.length > 0) {
    const jobListHtml = employeeShopMappings
      .map((mapping) => {
        const jobPostingsHtml = mapping.shop.jobPostings
          .map((job) => {
            const applyLink = `${APP_URL}/apply?employeeId=${employee.id}&jobId=${job.id}`;
            return `
              <li style="margin-bottom: 5px;">
                <p style="margin: 0;">Job Title: ${job.jobTitle}</p>
                <p style="margin: 0;">Salary: ₹${job.salaryPerMonth}</p>
                <p style="margin: 0;">Timing: ${job.timingFrom} - ${job.timingTo}</p>
                <a href="${applyLink}" style="color: #007bff; text-decoration: none;">Apply for this job</a>
              </li>
            `;
          })
          .join('');

        return `
          <li style="margin-bottom: 10px;">
            <h4 style="margin: 0;">${mapping.shop.shopName}</h4>
            <p style="margin: 0;">Owner: ${mapping.shop.ownerName}</p>
            <p style="margin: 0;">Location: ${mapping.shop.shopLocation}</p>
            <p style="margin: 0;">Email: ${mapping.shop.ownerEmail}</p>
            <p style="margin: 0;">Contact: ${mapping.shop.ownerMobile}</p>
            <ul style="list-style-type: none; padding: 0; margin-top: 10px;">
              ${jobPostingsHtml}
            </ul>
            <hr />
          </li>
        `;
      })
      .join('');

    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hi ${employee.name},</h2>
        <p>Welcome to TezzJob! We have found <strong>${employeeShopMappings.length}</strong> jobs that match your preferred locations. Here are the details:</p>
        <ul style="list-style-type: none; padding: 0;">
          ${jobListHtml}
        </ul>
        <p>Best of luck with your applications!</p>
        <p>Regards,<br/>TezzJob Team</p>
      </div>
    `;

    await sendEmail(
      employee.email,
      `Found ${employeeShopMappings.length} jobs matching your preferred locations!`,
      emailBody
    );
  } else {
    logger.error(`Failed to send email for 0 matching jobs, employeeId: ${employee.id}`);
  }
};

const setEmployeeRelavantJobs = async (prisma: Prisma.TransactionClient, employee: Employee) => {
    const { locality } = employee;

    console.log(locality);

    const matchingLocalitiesShops = await prisma.shop.findMany({
        where: {
            shopLocation: {
                in: locality
            }
        }
    })

    const mapping: { employeeId: EmployeeShopMapping['employeeId'], shopId: EmployeeShopMapping['shopId'] } [] = []

    for (const shop of matchingLocalitiesShops) {
        mapping.push({employeeId: employee.id, shopId: shop.id })
    }

    await prisma.employeeShopMapping.createMany({
        data: mapping
    })

    return matchingLocalitiesShops;
}

export const applyToJob = async (employeeId: Employee['id'], jobPostId: Shop['id']) => {

  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId
    }
  });
  if (!employee) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Employee who is trying to apply does not exist`)
  }

  const job = await prisma.jobPosting.findUnique({
    where: {
      id: jobPostId
    }
  })
  if (!job) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Job posting does not exist`)
  }
    let mapping = await prisma.employeeJobPostingMapping.findFirst({
        where: {
            employeeId,
            jobPostingId: jobPostId
        }
    })

    if (!mapping) {
        mapping = await prisma.employeeJobPostingMapping.create({
            data: {
                employeeId,
                jobPostingId: jobPostId
            }
        })
    }

    return mapping;
}