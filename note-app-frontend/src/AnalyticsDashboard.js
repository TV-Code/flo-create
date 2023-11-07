import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Container, Grid, Card, CardContent, Typography, Box, CircularProgress, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, RadialBarChart, RadialBar } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#82ca9d', '#8884d8', '#ffc658'];

const TaskCompletionTrendCard = ({ data }) => (
    <Paper elevation={3} sx={{ height: '100%', padding: '20px', borderRadius: '15px' }}>
      <Typography variant="h5" color="primary">Task Completion Trend</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.task_completion_trend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(dateStr) => format(new Date(dateStr), 'MMM dd')} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="completed_count" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );

const NoteCard = ({ data }) => (
  <Paper elevation={3} sx={{ height: '100%', padding: '20px', borderRadius: '15px' }}>
    <Typography variant="h5" color="primary">Total Notes</Typography>
    <Typography variant="h6" color="secondary">Recent: {data.recent_notes}</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={[{name: 'Notes', value: data.total_notes}]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

const TaskCard = ({ data }) => (
  <Paper elevation={3} sx={{ height: '100%', padding: '20px', borderRadius: '15px' }}>
    <Typography variant="h5" color="primary">Tasks Progress</Typography>
    <Typography variant="h6" color="secondary">Recent: {data.recent_tasks}</Typography>
    <ResponsiveContainer width="80%" height={300}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={[{name: 'Tasks', uv: data.average_task_progress, fill: '#82ca9d'}]}>
        <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey='uv' />
        <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' wrapperStyle={{ top: 0, right: 0, transform: 'translate(0, 0)'}} />
        <Tooltip />
      </RadialBarChart>
    </ResponsiveContainer>
  </Paper>
);

const AnalyticsDashboard = () => {
  const [data, setData] = useState({ tasks_per_category: [] });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/analytics')
      .then(res => {
        setData(res.data);
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        setLoading(false); 
      });
  }, []);

  if (loading) { 
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TaskCard data={data} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <NoteCard data={data} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TaskCompletionTrendCard data={data} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default AnalyticsDashboard;
