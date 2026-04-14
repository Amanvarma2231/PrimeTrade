import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Settings from '../components/layout/Settings';
import { Plus, Trash2, Edit2, TrendingUp, DollarSign, PieChart, Loader2, X, Settings as SettingsIcon } from 'lucide-react';

const Dashboard = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        coinName: '',
        symbol: '',
        amount: '',
        buyPrice: ''
    });

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await api.get('/portfolio');
            setAssets(res.data.data);
        } catch (err) {
            console.error('Error fetching assets', err);
            setAssets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAsset) {
                await api.put(`/portfolio/${editingAsset._id}`, formData);
            } else {
                await api.post('/portfolio', formData);
            }
            setShowModal(false);
            setEditingAsset(null);
            setFormData({ coinName: '', symbol: '', amount: '', buyPrice: '' });
            fetchAssets();
        } catch (err) {
            alert(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await api.delete(`/portfolio/${id}`);
                fetchAssets();
            } catch (err) {
                alert('Failed to delete asset');
            }
        }
    };

    const handleEdit = (asset) => {
        setEditingAsset(asset);
        setFormData({
            coinName: asset.coinName,
            symbol: asset.symbol,
            amount: asset.amount,
            buyPrice: asset.buyPrice
        });
        setShowModal(true);
    };

    const totalValue = assets.reduce((acc, curr) => acc + (Number(curr.amount) * Number(curr.buyPrice)), 0);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={40} color="var(--primary)" />
        </div>
    );

    return (
        <div className="container animate-fade" style={{ paddingBottom: '4rem' }}>
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--primary)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Investment</p>
                        <h2 style={{ fontSize: '1.5rem' }}>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                    </div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--accent)' }}>
                        <PieChart size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Assets</p>
                        <h2 style={{ fontSize: '1.5rem' }}>{assets.length}</h2>
                    </div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--primary)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Status</p>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>Active</h2>
                    </div>
                </div>
            </div>

            {/* Header & Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem' }}>Your Portfolio</h2>
                    {user && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Logged in as <strong>{user.username}</strong> · {user.role}</p>}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="glass"
                        style={{ padding: '0.75rem', borderRadius: '10px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
                    >
                        <SettingsIcon size={20} />
                    </button>
                    <button
                        onClick={() => { setEditingAsset(null); setFormData({ coinName: '', symbol: '', amount: '', buyPrice: '' }); setShowModal(true); }}
                        style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                    >
                        <Plus size={20} /> Add Asset
                    </button>
                </div>
            </div>

            {/* Assets Table */}
            <div className="glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '1.25rem' }}>Asset</th>
                            <th style={{ padding: '1.25rem' }}>Symbol</th>
                            <th style={{ padding: '1.25rem' }}>Amount</th>
                            <th style={{ padding: '1.25rem' }}>Buy Price</th>
                            <th style={{ padding: '1.25rem' }}>Total</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No assets found. Click "Add Asset" to get started!
                                </td>
                            </tr>
                        ) : (
                            assets.map((asset) => (
                                <tr key={asset._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'var(--transition)' }}>
                                    <td style={{ padding: '1.25rem', fontWeight: 600 }}>{asset.coinName}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                                            {asset.symbol}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>{asset.amount}</td>
                                    <td style={{ padding: '1.25rem' }}>${Number(asset.buyPrice).toLocaleString()}</td>
                                    <td style={{ padding: '1.25rem', color: 'var(--accent)', fontWeight: 600 }}>
                                        ${(Number(asset.amount) * Number(asset.buyPrice)).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => handleEdit(asset)} style={{ color: 'var(--text-muted)', background: 'none', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(asset._id)} style={{ color: 'var(--error)', background: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass animate-fade" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Coin Name</label>
                                    <input name="coinName" className="glass" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} value={formData.coinName} onChange={handleInputChange} placeholder="Bitcoin" required />
                                </div>
                                <div style={{ width: '100px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Symbol</label>
                                    <input name="symbol" className="glass" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} value={formData.symbol} onChange={handleInputChange} placeholder="BTC" required />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Amount</label>
                                <input name="amount" type="number" step="any" className="glass" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} value={formData.amount} onChange={handleInputChange} placeholder="0.5" required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Buy Price ($)</label>
                                <input name="buyPrice" type="number" step="any" className="glass" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} value={formData.buyPrice} onChange={handleInputChange} placeholder="45000" required />
                            </div>
                            <button type="submit" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '10px', fontWeight: 600, fontSize: '1rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                                {editingAsset ? 'Update Asset' : 'Add to Portfolio'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            <Settings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                currentUser={user}
            />
        </div>
    );
};

export default Dashboard;
