import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConvocations, getBatches, getDepartments, getDegrees, getSpecializations } from "../../../Services/degreeCertificateService";
import "./DegreeFilterPage.css";

const DegreeFilterPage = () => {
    const navigate = useNavigate();

    const [convocations, setConvocations] = useState([]);
    const [batches, setBatches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [specializations, setSpecializations] = useState([]);


    const [filters, setFilters] = useState({
        convocation: "",
        batch: "",
        departmentId: "",
        degreeId: "",
        specializationId: ""
    });

    const loadConvocations = async () => {
        try {
            const response = await getConvocations();

            setConvocations(response.data.data || []);

        } catch (error) {
            console.error(error);
        }
    };

    const loadBatches = async () => {
        try {
            const response = await getBatches();

            setBatches(response.data.data || []);

        } catch (error) {
            console.error(error);
        }
    };

    const loadDepartments = async () => {
        try {
            const response = await getDepartments();

            setDepartments(response.data.data || []);

        } catch (error) {
            console.error(error);
        }
    };

    const loadDegrees = async () => {
        try {

            const response = await getDegrees();

            setDegrees(response.data || []);

        } catch (error) {
            console.error(error);
        }
    };

    const loadSpecializations = async () => {
        try {

            const response = await getSpecializations();

            setSpecializations(response.data || []);

        } catch (error) {
            console.error(error);
        }
    };

    const handleNext = () => {

        const selectedDepartment = departments.find(
            d => d.DepartmentID === filters.departmentId
        );

        const selectedDegree = degrees.find(
            d => d.DegreeID === filters.degreeId
        );

        const selectedSpecialization = specializations.find(
            s => s.SpecializationID === filters.specializationId
        );

        navigate("/degree/students", {
            state: {
                convocation: filters.convocation,
                batch: filters.batch,

                departmentId: filters.departmentId,
                degreeId: filters.degreeId,
                specializationId: filters.specializationId,

                departmentName:
                    selectedDepartment?.DepartmentName || "",

                degreeName:
                    selectedDegree?.DegreeName || "",

                specializationName:
                    selectedSpecialization?.SpecializationName || "None"
            }
        });

    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "departmentId") {
            setFilters(prev => ({
                ...prev,
                departmentId: value,
                specializationId: ""
            }));
            return;
        }

        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        loadConvocations();
        loadBatches();
        loadDepartments();
        loadDegrees();
        loadSpecializations();
    }, []);


    return (
        <div className="degree-filter-page">

            <div className="dc-filter-header">

                <h2>Degree Certificate Generation</h2>

                <p>
                    Select the criteria below to retrieve eligible students
                    for degree certificate generation.
                </p>

            </div>

            <div className="dc-filter-card">

                <div className="dc-filter-title">
                    Degree Certificate Filters
                </div>

                <div className="dc-filter-grid">

                    <div className="dc-form-group">
                        <label>Convocation *</label>

                        <select
                            name="convocation"
                            value={filters.convocation}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select Convocation
                            </option>

                            {convocations.map((item, index) => (
                                <option
                                    key={item.Convocation || index}
                                    value={item.Convocation}
                                >
                                    {item.Convocation}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="dc-form-group">
                        <label>Batch *</label>

                        <select
                            name="batch"
                            value={filters.batch}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select Batch
                            </option>

                            {batches.map((item, index) => (
                                <option
                                    key={item.Batch || index}
                                    value={item.Batch}
                                >
                                    {item.Batch}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="dc-form-group">
                        <label>Department *</label>

                        <select
                            name="departmentId"
                            value={filters.departmentId}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select Department
                            </option>

                            {departments.map((item, index) => (
                                <option
                                    key={item.DepartmentID || index}
                                    value={item.DepartmentID}
                                >
                                    {item.DepartmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="dc-form-group">
                        <label>Program *</label>

                        <select
                            name="degreeId"
                            value={filters.degreeId}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select Program
                            </option>

                            {degrees.map((item, index) => (
                                <option
                                    key={item.DegreeID || index}
                                    value={item.DegreeID}
                                >
                                    {item.DegreeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="dc-form-group dc-full-width">
                        <label>Specialization</label>

                        <select
                            name="specializationId"
                            value={filters.specializationId}
                            onChange={handleChange}
                        >
                            <option value="">
                                All Specializations
                            </option>

                            {specializations.map(item => (
                                <option
                                    key={item.SpecializationID}
                                    value={item.SpecializationID}
                                >
                                    {item.SpecializationName}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="dc-filter-footer">

                    <button
                        className="dc-next-btn"
                        onClick={handleNext}
                    >
                        View Students →
                    </button>

                </div>

            </div>

        </div>
    );
};

export default DegreeFilterPage;