import React, { useMemo, useState, useEffect } from 'react';
import logo from '../../assets/epayLogo.png';
import './academic.css';
import * as XLSX from 'xlsx';

function Academic() {

    const columns = [
        'Name',
        'Roll No',
        'Batch',
        'Program Name',
        'Amount',
        'Paid Amount',
        'Date'
    ];

    const [filters, setFilters] = useState({
        'Name': '',
        'Roll No': '',
        'Batch': '',
        'Program Name': '',
        'Amount': '',
        'Paid Amount': '',
        'Date': '',
    });

    const [data, setData] = useState([]);
    const [editedRows, setEditedRows] = useState({});
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;


    const filteredData = useMemo(() => {
        return data
            .map((row, rowIndex) => ({ row, rowIndex }))
            .filter(({ row }) => {
                return columns.every((col) => {
                    const filter = filters[col]
                        ?.toLowerCase()
                        ?.trim();

                    if (!filter) return true;

                    return (row[col] ?? '')
                        .toString()
                        .toLowerCase()
                        .includes(filter);
                });
            });
    }, [data, filters]);

    const pageCount = Math.ceil(
        filteredData.length / rowsPerPage
    );

    const paginatedData = useMemo(() => {

        const start =
            (currentPage - 1) * rowsPerPage;

        return filteredData.slice(
            start,
            start + rowsPerPage
        );

    }, [filteredData, currentPage]);

    const handleFilterChange = (col, value) => {
        setFilters((prev) => ({
            ...prev,
            [col]: value
        }));
    };

    const doExport = (type) => {

        // Prepare table data
        const exportData = paginatedData.map(({ row, rowIndex }) => {

            const newRow = {};

            columns.forEach((col) => {
                newRow[col] =
                    editedRows[rowIndex]?.[col]
                    ?? row[col]
                    ?? '';
            });

            return newRow;
        });

        // CSV Export
        if (type === 'csv') {

            const worksheet =
                XLSX.utils.json_to_sheet(exportData);

            const csv =
                XLSX.utils.sheet_to_csv(worksheet);

            const blob = new Blob(
                [csv],
                {
                    type: 'text/csv;charset=utf-8;'
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement('a');

            link.href = url;
            link.download = 'academic.csv';

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        }

        // Excel Export
        else if (type === 'excel') {

            const worksheet =
                XLSX.utils.json_to_sheet(exportData);

            const workbook =
                XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                'Academic'
            );

            XLSX.writeFile(
                workbook,
                'academic.xlsx'
            );
        }

        setShowExportMenu(false);
    };

    useEffect(() => {

        fetch('http://localhost:5000/test-academic')
            .then((response) => response.json())
            .then((result) => {
                setData(result);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);
    return (
        <div className="academic-page">

            <div className="header">

                <div className="logo-container">
                    <img
                        src={logo}
                        alt="logo"
                        className="logo"
                    />
                </div>

                <h2>
                    Academic Programme Section
                </h2>

            </div>

            <div className="export-section">

                <button
                    className="export-btn"
                    onClick={() =>
                        setShowExportMenu(!showExportMenu)
                    }
                >
                    Export
                </button>

                {showExportMenu && (

                    <div className="export-menu">

                        <button
                            onClick={() => doExport('csv')}
                        >
                            Export CSV
                        </button>

                        <button
                            onClick={() => doExport('excel')}
                        >
                            Export Excel
                        </button>

                    </div>

                )}

            </div>

            <div className="table-wrapper">

                <table className="academic-table">

                    <thead>

                        <tr>
                            {columns.map((col) => (
                                <th key={col}>
                                    {col}
                                </th>
                            ))}
                        </tr>

                        <tr>

                            {columns.map((col) => (
                                <th key={col}>
                                    <input
                                        className="filter-input"
                                        placeholder={`Search...`}
                                        value={filters[col]}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                col,
                                                e.target.value
                                            )
                                        }
                                    />
                                </th>
                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {paginatedData.map(
                            ({ row, rowIndex }) => (

                                <tr key={rowIndex}>

                                    {columns.map((col) => (

                                        <td key={col}>
                                            {row[col]}
                                        </td>

                                    ))}

                                </tr>

                            ))

                        }

                    </tbody>
                    

                </table>

            </div>
            <div className="pagination">

                <button
                    disabled={currentPage === 1}
                    onClick={() =>
                        setCurrentPage((prev) => prev - 1)
                    }
                >
                    Previous
                </button>

                <span>
                    Page {currentPage} of {pageCount}
                </span>

                <button
                    disabled={currentPage === pageCount}
                    onClick={() =>
                        setCurrentPage((prev) => prev + 1)
                    }
                >
                    Next
                </button>

            </div>

            <footer>
                All copyrights reserved to IIT Dharwad @2026
            </footer>

        </div>
    );
}

export default Academic;