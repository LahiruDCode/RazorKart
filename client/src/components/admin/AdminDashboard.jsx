import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../common/Menu';
import './AdminDashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
} from 'chart.js';
import { Line, Doughnut, Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Fake data for Sales Analytics chart
  const salesData = {
    labels: ['01', '03', '05', '07', '09', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29'],
    datasets: [
      {
        label: 'Traffic',
        data: [150, 210, 120, 165, 190, 220, 180, 210, 190, 180, 220, 175, 190, 200, 190],
        borderColor: 'rgba(46, 213, 177, 1)',
        backgroundColor: 'rgba(46, 213, 177, 0.3)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  };

  // Fake data for Top 5 Products donut chart
  const topProductsData = {
    labels: ['Gaming Keyboards', 'Gaming Mice', 'Headsets', 'Monitors', 'Mousepads'],
    datasets: [
      {
        data: [32, 25, 20, 15, 8],
        backgroundColor: [
          '#FFD166',
          '#FF85B3',
          '#5FBFF9',
          '#F06449',
          '#2EC4B6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          font: {
            size: 11
          },
          padding: 10
        }
      },
    },
  };

  // Earnings by Item Type pie data
  const earningsData = {
    labels: ['Gaming Keyboards', 'Gaming Mice', 'Headsets', 'Monitors'],
    datasets: [
      {
        data: [42, 23, 18, 17],
        backgroundColor: [
          '#FFD166',
          '#FF85B3',
          '#5FBFF9',
          '#F06449',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Bounce rate bar chart data
  const bounceRateData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bounce Rate',
        data: [32, 40, 28, 50, 42, 37, 45],
        backgroundColor: 'rgba(95, 191, 249, 0.7)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  };

  return (
    <div className="admin-layout">
      <Menu />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard Overview</h1>
          <div className="admin-info">
            <span>Welcome, {user.username}</span>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">546</p>
            <span className="stat-trend positive">+12.5%</span>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p className="stat-number">324</p>
            <span className="stat-trend positive">+4%</span>
          </div>
          <div className="stat-card">
            <h3>Pending Requests</h3>
            <p className="stat-number">18</p>
            <span className="stat-trend negative">-5%</span>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card sales-analytics">
            <div className="card-header">
              <h2>Sales Analytics</h2>
              <div className="card-actions">
                <select className="time-select">
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                </select>
              </div>
            </div>
            
            <div className="analytics-content">
              <div className="metrics">
                <div className="metric">
                  <h4>Traffic</h4>
                  <p className="metric-value">324,222</p>
                  <span className="metric-trend positive">+15%</span>
                </div>
                <div className="metric">
                  <h4>Orders</h4>
                  <p className="metric-value">123,432</p>
                  <span className="metric-trend positive">+4%</span>
                </div>
                <div className="metric">
                  <h4>Revenue</h4>
                  <p className="metric-value">$324,222</p>
                  <span className="metric-trend negative">-5%</span>
                </div>
              </div>
              
              <div className="chart-container">
                <Line data={salesData} options={salesOptions} height={200} />
              </div>
            </div>
          </div>
          
          <div className="analytics-card top-products">
            <h2>Top 5 Products</h2>
            <div className="donut-chart-container">
              <Doughnut data={topProductsData} options={donutOptions} />
            </div>
          </div>
          
          <div className="analytics-card conversion-rate">
            <h2>Conversion Rate</h2>
            <div className="conversion-stats">
              <div className="conversion-chart">
                <div className="conversion-value">33%</div>
                <div className="conversion-trend positive">+33%</div>
              </div>
              <div className="conversion-metrics">
                <div className="conversion-metric">
                  <h4>Cart Abandonment</h4>
                  <p>73%</p>
                  <span className="metric-trend positive">+15%</span>
                </div>
                <div className="conversion-metric">
                  <h4>Revenue Left</h4>
                  <p>$12,432</p>
                  <span className="metric-trend positive">+4%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-card item-earnings">
            <h2>Earnings By Item Type</h2>
            <div className="pie-chart-container">
              <Pie data={earningsData} />
            </div>
          </div>

          <div className="analytics-card bounce-rate">
            <div className="bounce-rate-header">
              <div>
                <h2>46.41%</h2>
                <p className="bounce-rate-label">BOUNCE RATE</p>
              </div>
              <div className="visits-counter">
                <h3>$15,678</h3>
                <p>VISITS</p>
              </div>
            </div>
            <div className="bar-chart-container">
              <Bar data={bounceRateData} options={barOptions} height={120} />
            </div>
          </div>

          <div className="analytics-card recent-reviews">
            <div className="reviews-header">
              <h2>Recent Reviews</h2>
              <select className="sort-select">
                <option>Sort By Newest</option>
                <option>Sort By Rating</option>
              </select>
            </div>
            <div className="review-item">
              <div className="review-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="review-title">for Gaming Keyboard X35</span>
              </div>
              <div className="review-info">
                <p>By Rajith Perera - 1 day ago</p>
              </div>
              <p className="review-content">
                Great keyboard with amazing RGB lighting. The mechanical switches feel fantastic for gaming.
              </p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="action-button"
              onClick={() => navigate('/admin/manage-users')}
            >
              Manage Users
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/admin/role-requests')}
            >
              View Role Requests
            </button>
            <button 
              className="action-button"
              onClick={() => navigate('/admin/profile')}
            >
              Profile Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
