import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import axios from "axios"
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';

const Home = () => {
    const [data, setData] = useState([]); // State to store fetched data
    const [pageData, setPageData] = useState([]); // State to store paginated data
    const [page, setPage] = useState(1); // State to store current page
    const [pageCount, setPageCount] = useState(0); // State to store total page count

    // Function to fetch data from API
    const getdata = async () => {
        const response = await axios.get("https://dummyjson.com/products");
        setData(response.data.products); // Set fetched data to state
    }

    // Handle next page button click
    const handleNext = () => {
        if (page === pageCount) return page; // If on the last page, do nothing
        setPage(page + 1); // Increment page number
    }

    // Handle previous page button click
    const handlePrevios = () => {
        if (page === 1) return page; // If on the first page, do nothing
        setPage(page - 1); // Decrement page number
    }

    // Fetch data on component mount and when page changes
    useEffect(() => {
        getdata();
    }, [page]);

    // Handle data pagination
    useEffect(() => {
        const pagedatacount = Math.ceil(data.length / 5); // Calculate total number of pages
        setPageCount(pagedatacount);

        if (page) {
            const LIMIT = 5; // Items per page
            const skip = LIMIT * page; // Calculate items to skip
            const dataskip = data.slice(page === 1 ? 0 : skip - LIMIT, skip); // Slice data for current page
            setPageData(dataskip); // Set paginated data to state
        }
    }, [data]);

    return (
        <>
            <div className="container">
                <h1>User Data</h1> {/* Page title */}

                <div className='table_div mt-3'>
                    <Table striped bordered hover> {/* Table component */}
                        <thead>
                            <tr>
                                <th>Id</th> {/* Table header for ID */}
                                <th>Price</th> {/* Table header for Price */}
                                <th>Title</th> {/* Table header for Title */}
                                <th>Thumbnail</th> {/* Table header for Thumbnail */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pageData.length > 0 ? // Check if pageData is available
                                    pageData.map((element, index) => {
                                        return (
                                            <tr key={index}> {/* Table row */}
                                                <td>{element.id}</td> {/* Data for ID */}
                                                <td>{element.price}</td> {/* Data for Price */}
                                                <td>{element.title}</td> {/* Data for Title */}
                                                <td><img src={element.thumbnail} style={{ width: 60, height: 60 }} alt="" /></td> {/* Data for Thumbnail */}
                                            </tr>
                                        )
                                    }) : 
                                    <div className='d-flex justify-content-center mt-4'>
                                        Loading... <Spinner animation="border" variant='danger' /> {/* Loading spinner */}
                                    </div>
                            }
                        </tbody>
                    </Table>
                </div>
                <div className='d-flex justify-content-end'> {/* Pagination controls container */}
                    <Pagination>
                        <Pagination.Prev onClick={handlePrevios} disabled={page === 1} /> {/* Previous page button, disabled if on the first page */}
                        {
                            Array(pageCount).fill(null).map((ele, index) => {
                                return (
                                    <Pagination.Item
                                        key={index}
                                        active={page === index + 1}
                                        onClick={() => setPage(index + 1)}
                                    >
                                        {index + 1} {/* Page number */}
                                    </Pagination.Item>
                                )
                            })
                        }
                        <Pagination.Next onClick={handleNext} disabled={page === pageCount} /> {/* Next page button, disabled if on the last page */}
                    </Pagination>
                </div>
            </div>
        </>
    )
}

export default Home
