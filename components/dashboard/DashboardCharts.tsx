'use client'

import React from 'react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// DashboardCharts component that renders various charts for the dashboard using Recharts library, including temperature trends, load distribution, system health score, and alert trends, with styling consistent with the application's theme
export function TemperatureTrendChart({ data = [] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Temperature Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="time" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2d3748' }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Area 
            type="monotone" 
            dataKey="temperature" 
            stroke="#0ea5e9" 
            fillOpacity={1} 
            fill="url(#colorTemp)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// LoadDistributionChart component that renders a bar chart showing load distribution across transformers, with styling consistent with the application's theme
export function LoadDistributionChart({ data = [] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Load Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="transformer" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2d3748' }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Bar dataKey="load" fill="#06b6d4" name="Load (A)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SystemHealthChart({ data = [] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">System Health Score</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis domain={[0, 100]} stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2d3748' }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Legend wrapperStyle={{ color: '#e5e7eb' }} />
          <Line 
            type="monotone" 
            dataKey="health" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ fill: '#22c55e', r: 4 }}
            name="Health (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AlertTrendChart({ data = [] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Alert Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2d3748' }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Legend wrapperStyle={{ color: '#e5e7eb' }} />
          <Bar dataKey="critical" fill="#ef4444" name="Critical" />
          <Bar dataKey="high" fill="#f97316" name="High" />
          <Bar dataKey="medium" fill="#eab308" name="Medium" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
