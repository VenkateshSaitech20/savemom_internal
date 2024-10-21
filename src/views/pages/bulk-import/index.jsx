'use client'
import Loader from '@/components/loader';
import { useState } from 'react';
import apiClient from '@/utils/apiClient';
import { showToast } from '@/utils/helper';
import { Typography, Card, CardHeader, CardContent, Button, Grid } from '@mui/material';
import { toast } from 'react-toastify';
const BulkImport = () => {
    const [fileInput, setFileInput] = useState('');
    const [userErr, setUserErr] = useState('');
    const [countryErr, setCountryErr] = useState('');
    const [stateErr, setStateErr] = useState('');
    const [cityErr, setCityErr] = useState('');
    const [distErr, setDistrictErr] = useState('');
    const handleFileChange = (e) => {
        setFileInput(e.target.files[0]);
    };
    //For User Bulk
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", fileInput);
        const response = await apiClient.post('/api/bulk-import/import-users', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.data.result === true) {
            showToast(true, response.data.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            setUserErr(response.data.message);
        }
    };
    //For Country Bulk
    const handleCountrySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", fileInput);
        const response = await apiClient.post('/api/bulk-import/import-countries', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.data.result === true) {
            showToast(true, response.data.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            setCountryErr(response.data.message);
        }
    };
    //For State Bulk
    const handleStateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", fileInput);
        const response = await apiClient.post('/api/bulk-import/import-states', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.data.result === true) {
            showToast(true, response.data.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            setStateErr(response.data.message);
        }
    };
    //For City Bulk
    const handleCitySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", fileInput);
        const response = await apiClient.post('/api/bulk-import/import-cities', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.data.result === true) {
            showToast(true, response.data.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            setCityErr(response.data.message);
        }
    };
    //For District Bulk
    const handleDistrictSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", fileInput);
        const response = await apiClient.post('/api/bulk-import/import-districts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.data.result === true) {
            showToast(true, response.data.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            setDistrictErr(response.data.message);
        }
    };
    const handleExport = async (fileType) => {
        try {
            const response = await apiClient.post('/api/bulk-import/export-excel', { fileType }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileType}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardHeader title='Users' />
                    <CardContent>
                        <div className='flex flex-col justify-between'>
                            <div className='mb-5'>
                                <div className='flex flex-col gap-y-1'>
                                    <Button variant='contained' style={{ width: '50%' }} startIcon={<i className='bx-download' />} onClick={() => handleExport('users')}> Download</Button>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between mb-4'>
                            <div className='flex flex-col items-start'>
                                <form onSubmit={handleUserSubmit}>
                                    <input type="file" className="mb-3" accept=".xlsx, .xls" onChange={handleFileChange} />
                                    <Button variant='contained' type='submit'>Upload</Button>
                                </form>
                                {userErr && <Typography style={{ color: 'red' }}>{userErr}</Typography>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardHeader title='Countries' />
                    <CardContent>
                        <div className='flex flex-col justify-between'>
                            <div className='mb-5'>
                                <div className='flex flex-col gap-y-1'>
                                    <Button variant='contained' style={{ width: '50%' }} startIcon={<i className='bx-download' />} onClick={() => handleExport('countries')}> Download</Button>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between mb-4'>
                            <div className='flex flex-col items-start'>
                                <form onSubmit={handleCountrySubmit}>
                                    <input type="file" className="mb-3" accept=".xlsx, .xls" onChange={handleFileChange} />
                                    <Button variant='contained' type='submit'>Upload</Button>
                                </form>
                                {countryErr && <Typography style={{ color: 'red' }}>{countryErr}</Typography>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardHeader title='States' />
                    <CardContent>
                        <div className='flex flex-col justify-between'>
                            <div className='mb-5'>
                                <div className='flex flex-col gap-y-1'>
                                    <Button variant='contained' style={{ width: '50%' }} startIcon={<i className='bx-download' />} onClick={() => handleExport('states')}> Download</Button>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between mb-4'>
                            <div className='flex flex-col items-start'>
                                <form onSubmit={handleStateSubmit}>
                                    <input type="file" className="mb-3" accept=".xlsx, .xls" onChange={handleFileChange} />
                                    <Button variant='contained' type='submit'>Upload</Button>
                                </form>
                                {stateErr && <Typography style={{ color: 'red' }}>{stateErr}</Typography>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardHeader title='Cities' />
                    <CardContent>
                        <div className='flex flex-col justify-between'>
                            <div className='mb-5'>
                                <div className='flex flex-col gap-y-1'>
                                    <Button variant='contained' style={{ width: '50%' }} startIcon={<i className='bx-download' />} onClick={() => handleExport('cities')}> Download</Button>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between mb-4'>
                            <div className='flex flex-col items-start'>
                                <form onSubmit={handleCitySubmit}>
                                    <input type="file" className="mb-3" accept=".xlsx, .xls" onChange={handleFileChange} />
                                    <Button variant='contained' type='submit'>Upload</Button>
                                </form>
                                {cityErr && <Typography style={{ color: 'red' }}>{cityErr}</Typography>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardHeader title='Districts' />
                    <CardContent>
                        <div className='flex flex-col justify-between'>
                            <div className='mb-5'>
                                <div className='flex flex-col gap-y-1'>
                                    <Button variant='contained' style={{ width: '50%' }} startIcon={<i className='bx-download' />} onClick={() => handleExport('districts')}> Download</Button>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between mb-4'>
                            <div className='flex flex-col items-start'>
                                <form onSubmit={handleDistrictSubmit}>
                                    <input type="file" className="mb-3 form-control" accept=".xlsx, .xls" onChange={handleFileChange} />
                                    <Button variant='contained' type='submit'>Upload</Button>
                                </form>
                                {distErr && <Typography style={{ color: 'red' }}>{distErr}</Typography>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default BulkImport;
