import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    maxWidth: 800,
    margin: 'auto',
    marginTop: 20,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
  },
});

const About = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Card className={classes.section}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              About TezzJob
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to TezzJob! We are dedicated to connecting job seekers with their dream jobs and helping employers find the best talent. Our platform is designed to make the job search and hiring process as smooth and efficient as possible.
            </Typography>
          </CardContent>
        </Card>

        <Card className={classes.section}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              Our mission is to empower individuals by providing them with the tools and resources they need to find meaningful employment. We strive to create a platform that is user-friendly, reliable, and effective in matching job seekers with the right opportunities.
            </Typography>
          </CardContent>
        </Card>

        <Card className={classes.section}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Our Vision
            </Typography>
            <Typography variant="body1" paragraph>
              Our vision is to be the leading job search platform, known for our commitment to excellence and our ability to connect people with opportunities that help them grow and succeed in their careers.
            </Typography>
          </CardContent>
        </Card>

        <Card className={classes.section}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Solutions We Provide
            </Typography>
            <Typography variant="body1" paragraph>
              TezzJob offers a comprehensive suite of solutions designed to streamline the job search and hiring process:
            </Typography>
            <Typography variant="body1" component="ul">
              <li>Advanced job search filters to help job seekers find the perfect match.</li>
              <li>Easy-to-use job posting tools for employers to attract top talent.</li>
              <li>Real-time email notifications to keep users updated on new opportunities and applications.</li>
              <li>Secure and reliable platform ensuring data privacy and protection.</li>
              <li>Personalized job recommendations based on user profiles and preferences.</li>
            </Typography>
          </CardContent>
        </Card>

        <Card className={classes.section}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Meet Our Team
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.avatar} src="/path/to/avatar2.jpg" />
                </ListItemAvatar>
                <ListItemText primary="Manav Thorve" secondary="Developer" />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.avatar} src="/path/to/avatar3.jpg" />
                </ListItemAvatar>
                <ListItemText primary="Manav Frnd 1" secondary="Developer" />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.avatar} src="/path/to/avatar4.jpg" />
                </ListItemAvatar>
                <ListItemText primary="Manav Frnd 2" secondary="Developer" />
              </ListItem>
              {/* Add more team members as needed */}
            </List>
          </CardContent>
        </Card>

        <Card className={classes.section}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              We would love to hear from you! If you have any questions, feedback, or inquiries, please feel free to reach out to us at:
            </Typography>
            <Typography variant="body1" paragraph>
              Email: tezzjob.services@gmail.com
            </Typography>
            <Typography variant="body1" paragraph>
              Address: JSPM College, Pune, Maharashtra, India
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default About;