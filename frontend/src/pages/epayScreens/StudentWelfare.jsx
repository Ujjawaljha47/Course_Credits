import React, { useState, useMemo, useEffect } from 'react';
import logo from '../../assets/epayLogo.png';
import './studentWelfare.css';
import * as XLSX from 'xlsx';

function StudentWelfare() {

    const [selectedComponent, setSelectedComponent] = useState("");

    const components = [
        "Non Academic Fee",
        "SAF",
        "HEF"
    ];

    const columns = [
        'Name',
        'Roll No',
        'Branch',
        'Period',
        'Amount',
        'Amount Received',
        'Is Paid?',
        'Verify By',
        'Verify On'
    ];

    const editableColumns = [
        'Is Paid?',
        'Verify By',
        'Verify On'
    ];

    const [filters, setFilters] = useState({
        Name: '',
        'Roll No': '',
        Branch: '',
        Period: '',
        Amount: '',
        'Amount Received': '',
        'Is Paid?': '',
        'Verify By': '',
        'Verify On': ''
    });

    const [data, setData] = useState([]);
    const [editedRows, setEditedRows] = useState({});
    const [submittedRows, setSubmittedRows] = useState({});
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 50;

    const filteredData = useMemo(() => {

        return data
            .map((row, rowIndex) => ({
                row,
                rowIndex
            }))
            .filter(({ row }) => {

                return columns.every((col) => {

                    const filter =
                        filters[col]
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

    const handleCellChange = (
        rowIndex,
        col,
        value
    ) => {

        setEditedRows((prev) => ({
            ...prev,
            [rowIndex]: {
                ...prev[rowIndex],
                [col]: value
            }
        }));

    };

    const handleSubmit = (rowIndex) => {

        const updates = editedRows[rowIndex];

        if (!updates) return;

        // Save values into actual table data
        setData((prev) => {

            const copy = [...prev];

            copy[rowIndex] = {
                ...copy[rowIndex],
                ...updates
            };

            return copy;
        });

        // Mark row as submitted/read-only
        setSubmittedRows((prev) => ({
            ...prev,
            [rowIndex]: true
        }));

    };


    const doExport = (type) => {

        const exportData =
            paginatedData.map(
                ({ row, rowIndex }) => {

                    const newRow = {};

                    columns.forEach((col) => {

                        newRow[col] =
                            editedRows[rowIndex]?.[col]
                            ?? row[col]
                            ?? '';

                    });

                    return newRow;

                }
            );

        const worksheet =
            XLSX.utils.json_to_sheet(exportData);

        if (type === 'csv') {

            const csv =
                XLSX.utils.sheet_to_csv(
                    worksheet
                );

            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            'text/csv;charset=utf-8;'
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement('a');

            link.href = url;

            link.download =
                'student-welfare.csv';

            link.click();

        }

        else {

            const workbook =
                XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                'Student Welfare'
            );

            XLSX.writeFile(
                workbook,
                'student-welfare.xlsx'
            );

        }

        setShowExportMenu(false);

    };

    useEffect(() => {

        fetch(
            'http://localhost:5000/test-sw'
        )
        .then((res)=>res.json())
        .then((result)=>{
            setData(result);
        })
        .catch(console.log);

    },[]);

    return (

<div className="student-page">

<div className="header">

<div className="logo-container">

<img
src={logo}
alt="logo"
className="logo"
/>

</div>

<h2>
Student Welfare Section
</h2>

</div>

<div className="component-section">

<label>
Component
</label>

<select
value={selectedComponent}
onChange={(e)=>
setSelectedComponent(
e.target.value
)}
>

<option value="">
Select Component
</option>

{components.map((item)=>(

<option
key={item}
value={item}
>
{item}
</option>

))}

</select>

</div>

<div className="export-section">

<button
className="export-btn"
onClick={()=>
setShowExportMenu(
!showExportMenu
)
}
>
Export
</button>

{showExportMenu && (

<div className="export-menu">

<button
onClick={()=>
doExport('csv')
}
>
Export CSV
</button>

<button
onClick={()=>
doExport('excel')
}
>
Export Excel
</button>

</div>

)}

</div>

{selectedComponent && (

<div className="table-wrapper">

<table className="student-table">

<thead>

<tr>

{columns.map((col)=>(

<th key={col}>
{col}
</th>

))}

<th>
Action
</th>

</tr>

<tr>

{columns.map((col)=>(

<th key={col}>

<input
className="filter-input"
placeholder="Search..."
value={filters[col]}
onChange={(e)=>
handleFilterChange(
col,
e.target.value
)}
/>

</th>

))}

<th></th>

</tr>

</thead>

<tbody>

{paginatedData.map(
({row,rowIndex})=>(

<tr key={rowIndex}>

{columns.map((col)=>(

<td key={col}>

{col==="Is Paid?" ? (

submittedRows[rowIndex] ? (

row[col]

) : (

<select
className="paid-dropdown"
value={
editedRows[rowIndex]?.[col]
?? row[col]
?? ""
}
onChange={(e)=>
handleCellChange(
rowIndex,
col,
e.target.value
)
}
>

<option value="">
Select
</option>

<option value="Yes">
Yes
</option>

<option value="No">
No
</option>

</select>

)

)

:

editableColumns.includes(col)

?

submittedRows[rowIndex]

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
onChange={(e)=>
handleCellChange(
rowIndex,
col,
e.target.value
)
}
/>

)

:

row[col]

}

</td>

))}

<td>

{
submittedRows[rowIndex]

?

(

<button
className="submit-btn"
disabled
>
Submitted
</button>

)

:

(

<button
className="submit-btn"
onClick={() =>
handleSubmit(
rowIndex
)
}
>
Submit
</button>

)

}

</td>

</tr>

))

}

</tbody>

</table>

</div>

)}

<div className="pagination">

<button
disabled={currentPage===1}
onClick={()=>
setCurrentPage(
prev=>prev-1
)
}
>
Previous
</button>

<span>
Page {currentPage}
of {pageCount}
</span>

<button
disabled={
currentPage===pageCount
}
onClick={()=>
setCurrentPage(
prev=>prev+1
)
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

export default StudentWelfare;