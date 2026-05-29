import React, { useMemo, useState, useEffect } from 'react';
import logo from '../../assets/epayLogo.png';
import './account.css';
import * as XLSX from 'xlsx';

function Account() {

    const columns = [
        'Name',
        'Roll No',
        'Branch',
        'Period',
        'Amount',
        'Paid Amount',
        'Due Date',
        'Transaction ID',
        'Date of Payment',
        'Payment verified By',
        'Order No'
    ];

    const [filters, setFilters] = useState({
        Name: '',
        'Roll No': '',
        Branch: '',
        Period: '',
        Amount: '',
        'Paid Amount': '',
        'Date of Payment': '',
        'Due Date': '',
        'Transaction ID': '',
        'Payment verified By': '',
        'Order No': '',
    });

    const [data, setData] = useState([]);
    const [editedRows, setEditedRows] = useState({});
    const [submittedRows, setSubmittedRows] = useState({});
    const [editingRows, setEditingRows] = useState({});
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    const editableColumns = [
        'Transaction ID',
        'Date of Payment',
        'Payment verified By'
    ];

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

    const handleCellChange = (rowIndex, col, value) => {
        setEditedRows((prev) => ({
            ...prev,
            [rowIndex]: {
                ...prev[rowIndex],
                [col]: value
            }
        }));
    };

    const handleAction = (rowIndex) => {

        // First submit
        if (!submittedRows[rowIndex]) {

            const updates =
                editedRows[rowIndex];

            if (updates) {

                setData((prev) => {

                    const copy = [...prev];

                    copy[rowIndex] = {
                        ...copy[rowIndex],
                        ...updates
                    };

                    return copy;
                });

            }

            setSubmittedRows((prev) => ({
                ...prev,
                [rowIndex]: true
            }));

            return;
        }

        // Enable editing
        if (!editingRows[rowIndex]) {

            setEditingRows((prev) => ({
                ...prev,
                [rowIndex]: true
            }));

            return;
        }

        // Save edited values
        const updates =
            editedRows[rowIndex];

        if (updates) {

            setData((prev) => {

                const copy = [...prev];

                copy[rowIndex] = {
                    ...copy[rowIndex],
                    ...updates
                };

                return copy;

            });

        }

        setEditingRows((prev) => ({
            ...prev,
            [rowIndex]: false
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
            link.download = 'accounts.csv';

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
                'Accounts'
            );

            XLSX.writeFile(
                workbook,
                'accounts.xlsx'
            );
        }

        setShowExportMenu(false);
    };

    useEffect(() => {

        fetch('http://localhost:5000/test-accounts')
            .then((response) => response.json())
            .then((result) => {
                setData(result);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);
    return (
        <div className="account-page">

            <div className="header">

                <div className="logo-container">
                    <img
                        src={logo}
                        alt="logo"
                        className="logo"
                    />
                </div>

                <h2>
                    Accounts Reconcilation
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

                <table className="account-table">

                    <thead>

                        <tr>
                            {columns.map((col) => (
                                <th key={col}>
                                    {col}
                                </th>
                            ))}
                            <th>Action</th>
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

                            <th></th>

                        </tr>

                    </thead>

                    <tbody>

                        {paginatedData.map(
                            ({ row, rowIndex }) => (

                                <tr key={rowIndex}>

                                    {columns.map((col) => (

                                        <td key={col}>

                                            {editableColumns.includes(col) ? (

                                                submittedRows[rowIndex] &&
                                                    !editingRows[rowIndex]

                                                    ?

                                                    (
                                                        row[col]
                                                    )

                                                    :

                                                    (

                                                        <input
                                                            className="cell-input"
                                                            value={
                                                                editedRows[rowIndex]?.[col]
                                                                ?? row[col]
                                                                ?? ''
                                                            }
                                                            onChange={(e) =>
                                                                handleCellChange(
                                                                    rowIndex,
                                                                    col,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />

                                                    )

                                            )

                                                :

                                                row[col]

                                            }

                                        </td>

                                    ))}

                                    <td>

                                        <button
                                            className="submit-btn"
                                            onClick={() =>
                                                handleAction(
                                                    rowIndex
                                                )
                                            }
                                        >

                                            {
                                                !submittedRows[rowIndex]
                                                    ? 'Submit'
                                                    :
                                                    editingRows[rowIndex]
                                                        ? 'Save'
                                                        : 'Edit'
                                            }

                                        </button>

                                    </td>

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

export default Account;