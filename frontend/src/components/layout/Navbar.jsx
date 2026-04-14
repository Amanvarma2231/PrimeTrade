import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, LayoutDashboard, Briefcase } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem' }}>
                <Briefcase size={24} color="var(--primary)" />
                <span>Prime<span style={{ color: 'var(--primary)' }}>Trade</span></span>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', transition: 'var(--transition)' }}>
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} color="var(--primary)" />
                                <span style={{ fontWeight: 500 }}>{user.username}</span>
                            </div>
                            <button onClick={handleLogout} className="glass" style={{ padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', color: 'var(--error)' }}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ fontWeight: 500 }}>Login</Link>
                        <Link to="/register" className="glass" style={{ padding: '0.6rem 1.2rem', backgroundColor: 'var(--primary)', border: 'none', color: 'white', fontWeight: 600 }}>
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
