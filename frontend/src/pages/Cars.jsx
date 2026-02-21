import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Filter, SlidersHorizontal, MapPin, Users, Fuel, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cars = () => {
    const loc = useLocation();
    const queryParams = new URLSearchParams(loc.search);

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        location: queryParams.get('location') || '',
        query: queryParams.get('query') || '',
        minPrice: '',
        maxPrice: ''
    });

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.type) params.append('type', filters.type);
                if (filters.location) params.append('location', filters.location);
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

                const res = await axios.get(`http://localhost:5000/api/cars?${params.toString()}`);
                setCars(res.data);
            } catch (err) {
                console.error('Error fetching cars:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">

            <div className="container py-12 flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-72 flex-shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 font-bold text-primary">
                            <SlidersHorizontal size={20} />
                            <span>Filters</span>
                        </div>

                        <div className="space-y-6">
                            <div className="form-group">
                                <label className="form-label text-xs uppercase tracking-wider text-gray-500">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        name="location"
                                        className="form-input pl-10 bg-gray-50 border-gray-200"
                                        placeholder="Addis Ababa..."
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label text-xs uppercase tracking-wider text-gray-500">Vehicle Type</label>
                                <select
                                    name="type"
                                    className="form-input bg-gray-50 border-gray-200"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Types</option>
                                    <option>Sedan</option>
                                    <option>SUV</option>
                                    <option>Hatchback</option>
                                    <option>Pickup</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="form-group">
                                    <label className="form-label text-xs uppercase tracking-wider text-gray-500">Min Price</label>
                                    <input
                                        name="minPrice"
                                        type="number"
                                        className="form-input bg-gray-50 border-gray-200"
                                        placeholder="0"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-xs uppercase tracking-wider text-gray-500">Max Price</label>
                                    <input
                                        name="maxPrice"
                                        type="number"
                                        className="form-input bg-gray-50 border-gray-200"
                                        placeholder="Any"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full py-3 text-sm font-bold text-primary bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                                onClick={() => setFilters({ type: '', location: '', minPrice: '', maxPrice: '', query: '' })}
                            >
                                Reset All Filters
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Car Grid */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black">Available Cars ({cars.length})</h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
                            ))}
                        </div>
                    ) : cars.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <Filter size={40} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No cars found</h3>
                            <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">We couldn't find any vehicles matching your current filters. Try adjusting your criteria.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setFilters({ type: '', location: '', minPrice: '', maxPrice: '', query: '' })}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {cars.map(car => (
                                <Link to={`/cars/${car.id}`} key={car.id} className="no-underline group">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full group-hover:border-primary/20">
                                        <div className="relative h-48 overflow-hidden">
                                            <img src={car.images[0] || "https://images.unsplash.com/photo-1549317336-206569e8475c?auto=format&fit=crop&q=80&w=1000"}
                                                alt={car.model}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-lg font-black text-primary shadow-lg border border-gray-50 text-sm">
                                                ${car.pricePerDay}<span className="font-normal text-xs text-gray-500">/day</span>
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="mb-4">
                                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{car.make} {car.model}</h3>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                                                    <MapPin size={14} /> {car.location}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-auto border-t border-gray-50 pt-4">
                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                    <Users size={14} className="text-gray-400" /> {car.seats} Seats
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                    <Gauge size={14} className="text-gray-400" /> {car.transmission}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                    <Fuel size={14} className="text-gray-400" /> {car.fuelType}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                                                    {car.type}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Cars;
