import z from 'zod'
import { CreateJobReq, LoginShopReq, RegisterShopReq } from '../utils/req.zod'
import prisma from '../prisma/prisma'
import { ApiError } from '../middlewares/errors'
import httpStatus from 'http-status'
import { data } from 'react-router-dom'
import { sendEmail } from '../mailer/sendMail'
import { Shop } from '@prisma/client'
import { LoggedInUserType } from '../middlewares/auth'

export const registerShop = async (req: z.infer<typeof RegisterShopReq>) => {


    if (req.password.length === 0 || req.confirmPassword !== req.password)
        throw new ApiError(httpStatus.BAD_REQUEST, `Passwords doesn't match`);

    let existingShop = await prisma.shop.findFirst({
        where: {
            ownerEmail: req.ownerEmail
        }
    })

    if (existingShop !== null) {
        throw new ApiError(httpStatus.BAD_REQUEST, `shop for this owner email already exists! Please login`)
    }

    existingShop = await prisma.shop.findFirst({
      where: {
        ownerMobile: req.ownerMobile,
      },
    });

    if (existingShop !== null) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `shop for this owner mobile already exists! Please login`
      );
    }

    const shop = await prisma.shop.create({
        data: {
            ownerEmail: req.ownerEmail,
            ownerMobile: req.ownerMobile, 
            password: req.password, 
            ownerName: req.ownerName, 
            shopLocation: req.shopLocation, 
            shopName: req.shopName, 
            isEmailValidated: false,
        }
    })

    await sendEmail(shop.ownerEmail, 'Validate Email', `
    Hi ${shop.ownerName}, <br />
    Please click below link to verify your email 
    http://localhost:3000/verify?uuid=${shop.uuid}    
    `)
}

export const verifyShop = async (uuid) => {
  // Check if token exists in database
  const shop = await prisma.shop.findFirst({ where: {uuid} });
  if (!shop) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Verification failed`)
  }
    
    if (shop.isEmailValidated) 
      throw new ApiError(httpStatus.BAD_REQUEST, `Account already verified`)

    await prisma.shop.update({
        data: { isEmailValidated: true },
        where: {id: shop.id},
    })
}

export const getShop = async (email: Shop['ownerEmail']) => {
  const shop = await prisma.shop.findUnique({
    where: {
      ownerEmail: email,
    }
  })

  if (!shop)
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid credentials`)
  
  return shop
}

export const getShopDetails = async (loggedInUser: LoggedInUserType) => {
  const shop = await prisma.shop.findUnique({
    where: {
      ownerEmail: loggedInUser.ownerEmail
    },
    select: {
      shopName: true, 
      ownerEmail: true, 
      ownerMobile: true, 
      shopLocation: true,
      businessCategory: true,
    }
  })

  const jobPostings = await prisma.jobPosting.findMany({
    where: {
      shopId: loggedInUser.shopId
    }, 
    select: {
      jobTitle: true,
      salaryPerMonth: true,
      isActive: true,
      id: true, 
      timingFrom: true,
      timingTo: true,
    }
  })

  return {
    shop,
    jobPostings
  }
}
 
export const createJobPost = async (loggedInUser: LoggedInUserType, jobPost: z.infer<typeof CreateJobReq>) => {
  const job = await prisma.jobPosting.create({
    data: {
      ...jobPost,
      shopId: loggedInUser.shopId
    }
  })

  return job
}

export const getApplicants = async (loggedInUser: LoggedInUserType, jobPostingId: number) => {
  const job = await prisma.jobPosting.findFirst({
    where: {
      id: jobPostingId,
      shopId: loggedInUser.shopId
    }
  })

  if (!job)
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid job id`)

  const applicants = await prisma.$queryRaw<
    { id: number; name: string; email: string; mobile: string }[]
  >`
  select e.id, e.name, e.email, e.mobile, ejp.is_shortlisted as "isShortListed"
  from job_postings jp 
  inner join employee_job_posting_mapping ejp on jp.id = ejp.job_posting_id
  inner join employee e on e.id = ejp.employee_id
  where jp.id = ${jobPostingId}
  `;

  return applicants
}

export const setEmployeeAcceptStatus = async (loggedInUser: LoggedInUserType, employeeId: number, jobPostingId: number, accpet: boolean) => {
  const job = await prisma.jobPosting.findFirst({
    where: {
      id: jobPostingId,
      shopId: loggedInUser.shopId
    }
  })

  if (!job)
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid job id`)

  const employee = await prisma.employee.findFirst({
    where: {
      id: employeeId
    }
  })

  if (!employee)
    throw new ApiError(httpStatus.BAD_REQUEST, `Employee does not exist`)

  const mapping = await prisma.employeeJobPostingMapping.findFirst({
    where: {
      employeeId,
      jobPostingId
    }
  })

  if (!mapping) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Employee does not applied to this job`)
  }

  await prisma.employeeJobPostingMapping.update({
    where: {
      id: mapping.id
    },
    data: {
      isShortListed: accpet
    }
  })
}

export const resetPassword = async (email: string, password: string) => {
  const shop = await prisma.shop.findFirst({
    where: {
      ownerEmail: email
    }
  })

  if(!shop) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid email`)
  }

  await prisma.shop.update({
    where: {
      id: shop.id
    },
    data: {
      password
    }
  })
}