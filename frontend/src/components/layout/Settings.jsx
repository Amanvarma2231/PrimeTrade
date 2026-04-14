import { useState } from 'react';
import api from '../../api';
import { User, Lock, Save, X, AlertCircle, CheckCircle } from 'lucide-react';

const Settings = ({ isOpen, onClose, currentUser }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [username, setUsername] = useState(currentUser?.username || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });
        try {
            const res = await api.put('/auth/updatedetails', { username, email });
            setStatus({ type: 'success', msg: 'Profile updated successfully!' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.error || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return setStatus({ type: 'error', msg: 'Passwords do not match' });
        }
        setLoading(true);
        setStatus({ type: '', msg: '' });
        try {
            await api.put('/auth/updatepassword', { 
                currentPassword: passwords.current, 
                newPassword: passwords.new 
            });
            setStatus({ type: 'success', msg: 'Password changed successfully!' });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.error || 'Password update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="glass animate-fade" style={{ width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Account Settings</h2>
                    <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <button 
                        onClick={() => { setActiveTab('profile'); setStatus({type:'', msg:''}); }}
                        style={{ padding: '0.75rem 1rem', background: 'none', color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : 'none', fontWeight: 600 }}
                    >
                        Profile
                    </button>
                    <button 
                        onClick={() => { setActiveTab('password'); setStatus({type:'', msg:''}); }}
                        style={{ padding: '0.75rem 1rem', background: 'none', color: activeTab === 'password' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'password' ? '2px solid var(--primary)' : 'none', fontWeight: 600 }}
                    >
                        Security
                    </button>
                </div>

                {status.msg && (
                    <div style={{ backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? 'var(--accent)' : 'var(--error)', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span style={{ fontSize: '0.9rem' }}>{status.msg}</span>
                    </div>
                )}

                {activeTab === 'profile' ? (
                    <form onSubmit={handleUpdateDetails} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="glass" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem' }} value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                            <input className="glass" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }} value={email} disabled />
                        </div>
                        <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
                            <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Current Password</label>
                            <input type="password" className="glass" style={{ width: '100%', padding: '0.75rem' }} value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>New Password</label>
                            <input type="password" className="glass" style={{ width: '100%', padding: '0.75rem' }} value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} required placeholder="Min. 6 chars" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Confirm New Password</label>
                            <input type="password" className="glass" style={{ width: '100%', padding: '0.75rem' }} value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} required />
                        </div>
                        <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
                            <Lock size={18} /> {loading ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Settings;
