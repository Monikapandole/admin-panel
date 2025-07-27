import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setResidentialProjects } from '../redux/residentialProjectSlice';
import { fetchAllResidentialProjects, deleteResidentialProjectAPI } from '../Api/services/residentialProjectService';
import { Loader } from "../Utils/Loader";
import { useNavigate } from 'react-router-dom';

const ResidentialProjectListPage = () => {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.residentialProject.projects);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await fetchAllResidentialProjects();
                dispatch(setResidentialProjects(data.data || []));
            } catch (error) {
                // handle error, e.g., show toast
                console.error('Failed to fetch residential projects', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await deleteResidentialProjectAPI(id);
            // Refetch the list after delete
            const data = await fetchAllResidentialProjects();
            dispatch(setResidentialProjects(data.data || []));
        } catch (error) {
            alert('Failed to delete project.');
        }
    };

    return (
        <div className="p-6 pt-[80px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Residential Projects</h2>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => navigate("/add-residential-project")}
                >
                    + Add Project
                </button>
            </div>
            <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Project Name</th>
                            <th className="px-6 py-3 font-semibold">Location</th>
                            <th className="px-6 py-3 font-semibold">Owner</th>
                            <th className="px-6 py-3 font-semibold">Category</th>
                            <th className="px-6 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="py-16 text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project.id} className="border-t">
                                    <td className="px-6 py-4">{project.residential_name || project.residential_name}</td>
                                    <td className="px-6 py-4">{project.city}</td>
                                    <td className="px-6 py-4">{project.owner_name}</td>
                                    <td className="px-6 py-4">{project.category_name}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600"
                                            onClick={() => navigate(`/residential-project/${project.residential_id}`, { state: { project } })}
                                        >
                                            View
                                        </button>
                                        <button className="bg-yellow-400 px-3 py-1 rounded text-white hover:bg-yellow-500"
                                            onClick={() => navigate(`/edit-residential-project/${project.residential_id}`, { state: { project } })}
                                        >
                                            Edit
                                        </button>
                                        <button className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                                            onClick={() => handleDelete(project.residential_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResidentialProjectListPage; 