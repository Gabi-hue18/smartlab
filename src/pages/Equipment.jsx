import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Download,
  Trash2,
  Boxes,
  CircleCheck,
  Wrench,
  TriangleAlert,
  SlidersHorizontal,
  ExternalLink,
  MapPin,
  CalendarClock,
  PackageOpen
} from 'lucide-react'

import {
  deleteEquipment,
  getEquipment
} from '../lib/store'

import StatusBadge from '../components/StatusBadge'

export default function Equipment() {

  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')

  const load = () => getEquipment().then(setItems)

  useEffect(() => {
    load()
  }, [])

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {

    const query = q.toLowerCase().trim()

    return items.filter(e => {

      const matchesStatus =
        status === 'all' || e.status === status

      const searchable = `
        ${e.name || ''}
        ${e.asset_id || ''}
        ${e.location || ''}
        ${e.category || ''}
        ${e.manufacturer || ''}
        ${e.model || ''}
      `.toLowerCase()

      return (
        matchesStatus &&
        searchable.includes(query)
      )

    })

  }, [items, q, status])

  /* ================= COUNTERS ================= */

  const available =
    items.filter(e => e.status === 'available').length

  const maintenance =
    items.filter(e => e.status === 'maintenance').length

  const attention =
    items.filter(
      e =>
        e.status === 'damaged' ||
        e.status === 'maintenance'
    ).length

  /* ================= DELETE ================= */

  async function remove(id) {

    const confirmed =
      confirm(
        'Delete this equipment record? This action cannot be undone.'
      )

    if (!confirmed) return

    await deleteEquipment(id)

    load()
  }

  /* ================= CSV ================= */

  function exportCsv() {

    const rows = [
      [
        'Asset ID',
        'Name',
        'Category',
        'Manufacturer',
        'Model',
        'Location',
        'Status',
        'Calibration'
      ],

      ...filtered.map(e => [
        e.asset_id,
        e.name,
        e.category,
        e.manufacturer,
        e.model,
        e.location,
        e.status,
        e.next_calibration
      ])
    ]

    const csv = rows
      .map(row =>
        row
          .map(value =>
            `"${String(value ?? '')
              .replaceAll('"', '""')}"`
          )
          .join(',')
      )
      .join('\n')

    const url = URL.createObjectURL(
      new Blob(
        [csv],
        { type: 'text/csv;charset=utf-8;' }
      )
    )

    const a = document.createElement('a')

    a.href = url
    a.download = 'smartlab-equipment.csv'
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <>

      {/* ================= HEADER ================= */}

      <div className="asset-header">

        <div>

          <div className="command-label">
            <span></span>
            ASSET REGISTRY
          </div>

          <h1>Equipment Management</h1>

          <p>
            Search, monitor and manage laboratory equipment
            throughout its complete lifecycle.
          </p>

        </div>


        <div className="asset-header-actions">

          <button
            className="asset-export-btn"
            onClick={exportCsv}
          >
            <Download size={16}/>
            Export CSV
          </button>

          <Link
            className="asset-add-btn"
            to="/equipment/new"
          >
            <Plus size={17}/>
            Add equipment
          </Link>

        </div>

      </div>


      {/* ================= SUMMARY ================= */}

      <div className="asset-summary-grid">

        <div className="asset-summary-card">

          <div className="asset-summary-icon blue">
            <Boxes size={20}/>
          </div>

          <div>
            <span>Total Assets</span>
            <strong>{items.length}</strong>
          </div>

        </div>


        <div className="asset-summary-card">

          <div className="asset-summary-icon green">
            <CircleCheck size={20}/>
          </div>

          <div>
            <span>Available</span>
            <strong>{available}</strong>
          </div>

        </div>


        <div className="asset-summary-card">

          <div className="asset-summary-icon orange">
            <Wrench size={20}/>
          </div>

          <div>
            <span>Maintenance</span>
            <strong>{maintenance}</strong>
          </div>

        </div>


        <div className="asset-summary-card">

          <div className="asset-summary-icon red">
            <TriangleAlert size={20}/>
          </div>

          <div>
            <span>Needs Attention</span>
            <strong>{attention}</strong>
          </div>

        </div>

      </div>


      {/* ================= REGISTRY PANEL ================= */}

      <section className="asset-registry-panel">

        <div className="asset-registry-head">

          <div>

            <h3>Equipment Registry</h3>

            <p>
              {filtered.length} of {items.length} assets displayed
            </p>

          </div>

          <div className="registry-indicator">

            <span></span>

            Live inventory

          </div>

        </div>


        {/* SEARCH + FILTER */}

        <div className="asset-toolbar">

          <div className="asset-search">

            <Search size={17}/>

            <input
              placeholder="Search by equipment, asset ID, manufacturer, model or location..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />

            {q && (
              <button
                onClick={() => setQ('')}
                type="button"
              >
                Clear
              </button>
            )}

          </div>


          <div className="asset-filter">

            <SlidersHorizontal size={16}/>

            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
            >

              <option value="all">
                All statuses
              </option>

              <option value="available">
                Available
              </option>

              <option value="in_use">
                In use
              </option>

              <option value="maintenance">
                Maintenance
              </option>

              <option value="damaged">
                Damaged
              </option>

              <option value="retired">
                Retired
              </option>

            </select>

          </div>

        </div>


        {/* ================= TABLE ================= */}

        {filtered.length ? (

          <div className="asset-table-wrap">

            <table className="asset-table">

              <thead>

                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Calibration</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {filtered.map(e => (

                  <tr key={e.id}>

                    {/* EQUIPMENT */}

                    <td>

                      <Link
                        className="modern-asset-link"
                        to={`/equipment/${e.id}`}
                      >

                        <div className="equipment-avatar">
                          <Boxes size={18}/>
                        </div>

                        <div>

                          <strong>
                            {e.name}
                          </strong>

                          <span>
                            {e.asset_id || 'No asset ID'}
                          </span>

                          <small>

                            {[
                              e.manufacturer,
                              e.model
                            ]
                              .filter(Boolean)
                              .join(' ') || 'Equipment'}

                          </small>

                        </div>

                      </Link>

                    </td>


                    {/* CATEGORY */}

                    <td>

                      <span className="asset-category">
                        {e.category || '—'}
                      </span>

                    </td>


                    {/* LOCATION */}

                    <td>

                      <div className="asset-location">

                        <MapPin size={14}/>

                        <span>
                          {e.location || 'Not assigned'}
                        </span>

                      </div>

                    </td>


                    {/* STATUS */}

                    <td>

                      <StatusBadge
                        value={e.status}
                      />

                    </td>


                    {/* CALIBRATION */}

                    <td>

                      <div className="calibration-cell">

                        <CalendarClock size={14}/>

                        <span>
                          {e.next_calibration || 'Not scheduled'}
                        </span>

                      </div>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="asset-actions">

                        <Link
                          className="asset-open-btn"
                          to={`/equipment/${e.id}`}
                        >

                          Open

                          <ExternalLink size={13}/>

                        </Link>


                        <button
                          className="asset-delete-btn"
                          title="Delete equipment"
                          onClick={() => remove(e.id)}
                        >

                          <Trash2 size={15}/>

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="asset-empty-state">

            <div>
              <PackageOpen size={30}/>
            </div>

            <h3>No equipment found</h3>

            <p>
              {items.length
                ? 'No assets match your current search or filter.'
                : 'Your equipment registry is currently empty.'
              }
            </p>

            {!items.length && (

              <Link
                to="/equipment/new"
                className="asset-add-btn"
              >

                <Plus size={16}/>
                Register first equipment

              </Link>

            )}

          </div>

        )}

      </section>

    </>
  )
}
