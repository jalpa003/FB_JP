import React, { useEffect, useState } from 'react';
import { FormControlLabel, Switch, FormGroup, FormControl, FormLabel, Checkbox, Grid, Paper } from '@mui/material';
import axios from 'axios';

const AdditionalQuestions = ({ jobId, consentToAddQuestions, setConsentToAddQuestions, setSelectedQuestions, selectedQuestions }) => {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

    useEffect(() => {
        if (consentToAddQuestions) {
            fetchQuestions();
            //`selectedQuestions` prop is an array of question IDs
            setSelectedQuestionIds(selectedQuestions);
        }
    }, [consentToAddQuestions, selectedQuestions]);

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/additional-questions`, {
                headers: { Authorization: `${token}` },
            });
            setQuestions(response.data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        }
    };

    const handleQuestionChange = (questionId, isChecked) => {
        const updatedSelectedQuestionIds = isChecked
            ? [...selectedQuestionIds, questionId]
            : selectedQuestionIds.filter(id => id !== questionId);

        setSelectedQuestionIds(updatedSelectedQuestionIds);
        setSelectedQuestions(updatedSelectedQuestionIds);
    };

    const handleSwitchChange = async (isChecked) => {
        setConsentToAddQuestions(isChecked);
        if (!isChecked) {
            // Clear selected questions
            setSelectedQuestionIds([]);
            setSelectedQuestions([]);

            // Call API to update the job (remove all selected questions)
            try {
                const token = localStorage.getItem('token');
                await axios.put(`${process.env.REACT_APP_API_URL}/job/update/${jobId}`, { additionalQuestions: [] }, {
                    headers: { Authorization: `${token}` },
                });
                // Handle success (optional)
            } catch (error) {
                console.error('Failed to update job:', error);
                // Handle error (optional)
            }
        }
    };

    return (
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
            <FormControl component="fieldset">
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={consentToAddQuestions} onChange={(e) => handleSwitchChange(e.target.checked)} />}
                        label={<span style={{ fontWeight: 'bold', color: 'blue' }}>Include additional questions for applicants</span>}
                    />
                    {consentToAddQuestions && (
                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                            <Grid item xs={12}>
                                <FormLabel component="legend">Select Questions:</FormLabel>
                            </Grid>
                            {questions.map((question) => (
                                <Grid item xs={12} sm={6} key={question._id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) => handleQuestionChange(question._id, e.target.checked)}
                                                checked={selectedQuestionIds.includes(question._id)}
                                            />
                                        }
                                        label={question.question}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </FormGroup>
            </FormControl>
        </Paper>
    );
};

export default AdditionalQuestions;