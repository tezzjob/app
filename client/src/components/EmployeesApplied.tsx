import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINT_URL } from '../config';

const EmployeesApplied = () => {
  const { id } = useParams(); // Get Job ID from URL
  const navigate = useNavigate();
  interface Employee {
    id: string;
    name: string;
    email: string;
    mobile: string;
    isShortListed: boolean;
  }
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showShortlisted, setShowShortlisted] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT_URL}/applied-employees?jobId=${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch employees');
          return;
        }

        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError('Something went wrong. Please try again.');
      }
    };

    fetchEmployees();

    // Cleanup function to reset state when component unmounts
    return () => {
      setEmployees([]);
      setError(null);
      setSuccessMessage(null);
      setShowShortlisted(false);
    };
  }, [id]);

  const handleShortlist = async (employeeId: string, employeeName: string) => {
    try {
      const response = await fetch(`${API_ENDPOINT_URL}/shortlist-employee?employeeId=${employeeId}&jobId=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to shortlist employee');
        return;
      }

      // Update the employee's status in the local state
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId ? { ...employee, isShortListed: true } : employee
        )
      );

      // Set success message
      setSuccessMessage(`${employeeName} has been shortlisted successfully.`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const renderEmployees = () => {
    const filteredEmployees = employees.filter(
      (employee) => employee.isShortListed === showShortlisted
    );

    return filteredEmployees.length > 0 ? (
      filteredEmployees.map((employee) => (
        <Grid item xs={12} key={employee.id}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                {employee.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Email: {employee.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Contact: {employee.mobile}
              </Typography>
              <Typography
                variant="body2"
                color={employee.isShortListed ? 'green' : 'textSecondary'}
              >
                Status: {employee.isShortListed ? 'Shortlisted' : 'Pending'}
              </Typography>
              {!employee.isShortListed && (
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => handleShortlist(employee.id, employee.name)}
                >
                  Shortlist
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))
    ) : (
      <Grid item xs={12}>
        <Typography textAlign="center" color="textSecondary">
          No employees in this category.
        </Typography>
      </Grid>
    );
  };

  return (
    <Grid container spacing={3} sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 2 }}>
      <Grid item xs={12}>
        <Typography variant="h5" fontWeight={600} textAlign="center">
          Employees Applied for Job ID {id}
        </Typography>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Typography variant="body2" color="error" textAlign="center">
            {error}
          </Typography>
        </Grid>
      )}

      {successMessage && (
        <Grid item xs={12}>
          <Alert severity="success">{successMessage}</Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showShortlisted}
              onChange={(e) => setShowShortlisted(e.target.checked)}
            />
          }
          label="Show Shortlisted"
        />
      </Grid>

      {renderEmployees()}

      <Grid item xs={12}>
        <Button fullWidth variant="contained" onClick={() => navigate('/all-job-postings')}>
          Back to Job Postings
        </Button>
      </Grid>
    </Grid>
  );
};

export default EmployeesApplied;
