import { useEffect, useMemo, useState } from 'react'
import {
  Boxes,
  CircleCheck,
  Wrench,
  TriangleAlert,
  CalendarClock,
  Activity,
  Sparkles,
  ShieldCheck,
  Clock3,
  ArrowUpRight,
  Gauge,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

import {
  getEquipment,
  getMaintenance,
  getFaults
} from '../lib/store'

import MetricCard from '../components/MetricCard'
import StatusBadge from '../components/StatusBadge'

import {
  format,
  parseISO,
  differenceInCalendarDays,
  subMonths,
  startOfMonth,
  isSameMonth
} from 'date-fns'

const colors = [
  '#2f80ed',
  '#22a06b',
  '#f5a623',
  '#d64545',
  '#8b5cf6'
]

export default function Dashboard() {

  const [equipment, setEquipment] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [faults, setFaults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    Promise.all([
      getEquipment(),
      getMaintenance(),
      getFaults()
    ])
      .then(([e, m, f]) => {
        setEquipment(e || [])
        setMaintenance(m || [])
        setFaults(f || [])
      })
      .finally(() => setLoading(false))

  }, [])

  /* --------------------------------------------------
     BASIC COUNTS
  -------------------------------------------------- */

  const availableCount =
    equipment.filter(e => e.status === 'available').length

  const maintenanceCount =
    maintenance.filter(m => m.status !== 'completed').length

  const openFaultCount =
    faults.filter(f => f.status !== 'closed').length

  const availability =
    equipment.length
      ? Math.round((availableCount / equipment.length) * 100)
      : 0

  /* --------------------------------------------------
     EQUIPMENT STATUS CHART
  -------------------------------------------------- */

  const statusData = useMemo(() => {

    return [
      'available',
      'in_use',
      'maintenance',
      'damaged',
      'retired'
    ]
      .map(name => ({
        name,
        value:
          equipment.filter(e => e.status === name).length
      }))
      .filter(x => x.value)

  }, [equipment])

  /* --------------------------------------------------
     UPCOMING MAINTENANCE
  -------------------------------------------------- */

  const due = useMemo(() => {

    return maintenance
      .filter(m => m.status !== 'completed')
      .sort((a, b) => {

        if (!a.due_date) return 1
        if (!b.due_date) return -1

        return new Date(a.due_date) - new Date(b.due_date)

      })
      .slice(0, 5)

  }, [maintenance])

  /* --------------------------------------------------
     EQUIPMENT REQUIRING ATTENTION
  -------------------------------------------------- */

  const highRisk = useMemo(() => {

    return equipment.filter(e => {

      if (e.status === 'damaged') return true

      if (e.next_calibration) {

        const days =
          differenceInCalendarDays(
            parseISO(e.next_calibration),
            new Date()
          )

        return days <= 7
      }

      return false

    }).slice(0, 5)

  }, [equipment])

  /* --------------------------------------------------
     REAL MAINTENANCE TREND
  -------------------------------------------------- */

  const maintenanceTrend = useMemo(() => {

    const now = new Date()

    return Array.from({ length: 6 }, (_, index) => {

      const month =
        startOfMonth(
          subMonths(now, 5 - index)
        )

      const count =
        maintenance.filter(task => {

          const dateValue =
            task.completed_at ||
            task.due_date ||
            task.created_at

          if (!dateValue) return false

          try {

            return isSameMonth(
              parseISO(dateValue),
              month
            )

          } catch {
            return false
          }

        }).length

      return {
        month: format(month, 'MMM'),
        jobs: count
      }

    })

  }, [maintenance])

  /* --------------------------------------------------
     FAULT INFORMATION
  -------------------------------------------------- */

  const criticalFaults =
    faults.filter(
      f =>
        f.status !== 'closed' &&
        f.priority === 'critical'
    ).length

  /* --------------------------------------------------
     DASHBOARD
  -------------------------------------------------- */

  return (
    <>

      {/* ================= HEADER ================= */}

      <div className="command-header">

        <div>

          <div className="command-label">
            <span></span>
            LABORATORY COMMAND CENTER
          </div>

          <h1>
            Laboratory Overview
          </h1>

          <p>
            Monitor equipment health, maintenance activity
            and operational risks from one workspace.
          </p>

        </div>

        <div className="command-header-actions">

          <div className="system-health">

            <span className="health-dot"></span>

            <div>
              <strong>System operational</strong>
              <small>Cloud database connected</small>
            </div>

          </div>

          <div className="smart-chip">
            <Sparkles size={17}/>
            <span>Smart insights</span>
          </div>

        </div>

      </div>


      {/* ================= METRICS ================= */}

      <div className="metrics-grid dashboard-metrics">

        <MetricCard
          label="Total equipment"
          value={equipment.length}
          icon={Boxes}
        />

        <MetricCard
          label="Available"
          value={availableCount}
          icon={CircleCheck}
          tone="green"
        />

        <MetricCard
          label="Active maintenance"
          value={maintenanceCount}
          icon={Wrench}
          tone="orange"
        />

        <MetricCard
          label="Open faults"
          value={openFaultCount}
          icon={TriangleAlert}
          tone="red"
        />

      </div>


      {/* ================= OPERATION STRIP ================= */}

      <div className="operations-strip">

        <div className="operation-item">

          <div className="operation-icon good">
            <Gauge size={20}/>
          </div>

          <div>
            <span>Fleet availability</span>
            <strong>{availability}%</strong>
          </div>

        </div>


        <div className="operation-item">

          <div className="operation-icon">
            <Wrench size={20}/>
          </div>

          <div>
            <span>Service queue</span>
            <strong>{maintenanceCount}</strong>
          </div>

        </div>


        <div className="operation-item">

          <div className="operation-icon warning">
            <AlertCircle size={20}/>
          </div>

          <div>
            <span>Critical faults</span>
            <strong>{criticalFaults}</strong>
          </div>

        </div>


        <div className="operation-item">

          <div className="operation-icon">
            <Activity size={20}/>
          </div>

          <div>
            <span>Attention required</span>
            <strong>{highRisk.length}</strong>
          </div>

        </div>

      </div>


      {/* ================= MAIN GRID ================= */}

      <div className="command-grid">


        {/* EQUIPMENT STATUS */}

        <section className="panel command-panel">

          <div className="panel-head">

            <div>
              <p className="panel-kicker">
                ASSET HEALTH
              </p>

              <h3>
                Equipment Status
              </h3>

              <p>
                Current laboratory fleet distribution
              </p>
            </div>

            <div className="panel-icon">
              <Activity size={19}/>
            </div>

          </div>


          {statusData.length ? (

            <div className="chart-row modern-chart">

              <div className="donut-wrap">

                <ResponsiveContainer
                  width="100%"
                  height={250}
                >

                  <PieChart>

                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={67}
                      outerRadius={94}
                      paddingAngle={4}
                      stroke="none"
                    >

                      {statusData.map((_, i) => (

                        <Cell
                          key={i}
                          fill={
                            colors[i % colors.length]
                          }
                        />

                      ))}

                    </Pie>

                    <Tooltip/>

                  </PieChart>

                </ResponsiveContainer>


                <div className="donut-center">

                  <b>{equipment.length}</b>
                  <span>Total assets</span>

                </div>

              </div>


              <div className="legend-list modern-legend">

                {statusData.map((s, i) => (

                  <div key={s.name}>

                    <i
                      style={{
                        background:
                          colors[i % colors.length]
                      }}
                    />

                    <span>
                      {s.name.replace('_', ' ')}
                    </span>

                    <b>
                      {s.value}
                    </b>

                  </div>

                ))}

              </div>

            </div>

          ) : (

            <div className="dashboard-empty">

              <Boxes size={32}/>

              <strong>
                No equipment registered
              </strong>

              <span>
                Add laboratory equipment to start
                monitoring asset health.
              </span>

            </div>

          )}

        </section>


        {/* ATTENTION REQUIRED */}

        <section className="panel command-panel attention-panel">

          <div className="panel-head">

            <div>

              <p className="panel-kicker danger">
                PRIORITY MONITOR
              </p>

              <h3>
                Attention Required
              </h3>

              <p>
                Equipment requiring action
              </p>

            </div>

            <div className="panel-icon alert-icon">
              <Zap size={19}/>
            </div>

          </div>


          <div className="attention-list">

            {highRisk.length ? (

              highRisk.map(e => {

                const damaged =
                  e.status === 'damaged'

                return (

                  <div
                    className="attention-item"
                    key={e.id}
                  >

                    <div
                      className={
                        damaged
                          ? 'attention-symbol danger'
                          : 'attention-symbol warning'
                      }
                    >

                      {damaged
                        ? <TriangleAlert size={18}/>
                        : <CalendarClock size={18}/>
                      }

                    </div>


                    <div className="attention-content">

                      <strong>
                        {e.name}
                      </strong>

                      <span>
                        {e.asset_id || 'Equipment asset'}
                      </span>

                      <p>
                        {damaged
                          ? 'Equipment marked damaged. Inspection recommended.'
                          : 'Calibration is due within 7 days.'
                        }
                      </p>

                    </div>


                    <ArrowUpRight
                      className="attention-arrow"
                      size={18}
                    />

                  </div>

                )

              })

            ) : (

              <div className="all-clear">

                <div>
                  <ShieldCheck size={27}/>
                </div>

                <strong>
                  Laboratory looks healthy
                </strong>

                <span>
                  No urgent equipment risks
                  detected.
                </span>

              </div>

            )}

          </div>

        </section>


        {/* MAINTENANCE TREND */}

        <section className="panel command-panel">

          <div className="panel-head">

            <div>

              <p className="panel-kicker">
                SERVICE ACTIVITY
              </p>

              <h3>
                Maintenance Trend
              </h3>

              <p>
                Maintenance activity during
                the last six months
              </p>

            </div>

            <div className="panel-icon">
              <Wrench size={19}/>
            </div>

          </div>


          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <BarChart
              data={maintenanceTrend}
              margin={{
                top:10,
                right:5,
                left:-20,
                bottom:0
              }}
            >

              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                opacity={0.25}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip/>

              <Bar
                dataKey="jobs"
                fill="#2f80ed"
                radius={[7,7,3,3]}
                maxBarSize={38}
              />

            </BarChart>

          </ResponsiveContainer>

        </section>


        {/* QUICK SUMMARY */}

        <section className="panel command-panel">

          <div className="panel-head">

            <div>

              <p className="panel-kicker">
                OPERATIONS
              </p>

              <h3>
                Laboratory Summary
              </h3>

              <p>
                Current operational state
              </p>

            </div>

            <div className="panel-icon">
              <Activity size={19}/>
            </div>

          </div>


          <div className="summary-stack">

            <div className="summary-row">

              <div className="summary-icon green">
                <CheckCircle2 size={19}/>
              </div>

              <div>
                <span>Available equipment</span>
                <strong>
                  {availableCount} / {equipment.length}
                </strong>
              </div>

            </div>


            <div className="summary-row">

              <div className="summary-icon orange">
                <Clock3 size={19}/>
              </div>

              <div>
                <span>Pending maintenance</span>
                <strong>
                  {maintenanceCount}
                </strong>
              </div>

            </div>


            <div className="summary-row">

              <div className="summary-icon red">
                <TriangleAlert size={19}/>
              </div>

              <div>
                <span>Open fault reports</span>
                <strong>
                  {openFaultCount}
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* UPCOMING WORK */}

        <section className="panel command-panel command-wide">

          <div className="panel-head">

            <div>

              <p className="panel-kicker">
                MAINTENANCE QUEUE
              </p>

              <h3>
                Upcoming Work
              </h3>

              <p>
                Priority schedule for laboratory
                technicians
              </p>

            </div>

            <div className="panel-icon">
              <CalendarClock size={19}/>
            </div>

          </div>


          {due.length ? (

            <div className="table-wrap">

              <table className="command-table">

                <thead>

                  <tr>
                    <th>Task</th>
                    <th>Equipment</th>
                    <th>Due date</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {due.map(m => (

                    <tr key={m.id}>

                      <td>
                        <strong>
                          {m.title}
                        </strong>
                      </td>

                      <td>

                        <div className="equipment-cell">

                          <span>
                            {m.asset_id || '—'}
                          </span>

                          <b>
                            {m.equipment_name || 'Equipment'}
                          </b>

                        </div>

                      </td>

                      <td>

                        {m.due_date
                          ? format(
                              parseISO(m.due_date),
                              'dd MMM yyyy'
                            )
                          : '—'
                        }

                      </td>

                      <td>
                        <StatusBadge
                          value={m.priority}
                        />
                      </td>

                      <td>
                        <StatusBadge
                          value={m.status}
                        />
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="dashboard-empty compact">

              <CircleCheck size={28}/>

              <strong>
                Maintenance queue is clear
              </strong>

              <span>
                No pending maintenance tasks.
              </span>

            </div>

          )}

        </section>

      </div>

      {loading && (
        <div className="dashboard-loading">
          Loading laboratory data...
        </div>
      )}

    </>
  )
}
