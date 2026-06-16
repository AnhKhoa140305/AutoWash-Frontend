import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value, icon: Icon, trend, trendType = 'up', trendText, gradientClass }) => {
  return (
    <Card className={`autowash-card border-0 h-100 ${gradientClass ? gradientClass : ''}`}>
      <Card.Body className="p-0 d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span className={gradientClass ? 'text-white-50' : 'text-secondary'} style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              {title}
            </span>
            <h3 className="m-0 mt-2 font-weight-bold" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {value}
            </h3>
          </div>
          <div 
            className={`rounded-3 d-flex align-items-center justify-content-center ${gradientClass ? 'bg-white bg-opacity-20 text-white' : 'bg-primary-subtle text-primary'}`}
            style={{ width: '48px', height: '48px' }}
          >
            {Icon && <Icon className="fs-4" />}
          </div>
        </div>

        {(trend || trendText) && (
          <div className="d-flex align-items-center gap-1 mt-auto" style={{ fontSize: '0.825rem' }}>
            {trend && (
              <span className={`font-weight-bold ${gradientClass ? 'text-white' : (trendType === 'up' ? 'text-success' : 'text-danger')}`}>
                {trend}
              </span>
            )}
            <span className={gradientClass ? 'text-white-50' : 'text-muted'}>
              {trendText}
            </span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default StatCard;
