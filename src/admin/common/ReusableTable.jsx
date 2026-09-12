import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CImage,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const getImageUrl = (value) => {
  if (!value || value.startsWith('http') || value.startsWith('data:')) return value
  return `http://localhost:8090${value}`
}

const ReusableTable = ({
  columns = [],
  data = [],
  onEdit,
  onView,
  onDelete,
  showActions = true,
  striped = true,
  hover = true,
}) => {
  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <CTable striped={striped} hover={hover} responsive>
            <CTableHead>
              <CTableRow>
                {columns.map((col, index) => (
                  <CTableHeaderCell key={index} scope="col">
                    {col.header}
                  </CTableHeaderCell>
                ))}
                {showActions && <CTableHeaderCell scope="col">Actions</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {data.length === 0 ? (
                <CTableRow>
                  <CTableDataCell
                    colSpan={columns.length + (showActions ? 1 : 0)}
                    className="text-center text-muted"
                  >
                    No data available
                  </CTableDataCell>
                </CTableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <CTableRow key={row.id || rowIndex}>
                    {columns.map((col, colIndex) => (
                      <CTableDataCell key={colIndex}>
                        {col.render ? (
                          col.render(row[col.accessor], row, rowIndex)
                        ) : col.type === 'image' || col.accessor.toLowerCase().includes('image') ? (
                          row[col.accessor] ? (
                            <CImage
                              src={getImageUrl(row[col.accessor])}
                              alt={`${col.header} preview`}
                              width={48}
                              height={48}
                              className="border rounded"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            '-'
                          )
                        ) : (
                          row[col.accessor]
                        )}
                      </CTableDataCell>
                    ))}

                    {showActions && (
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          {onView && (
                            <CButton
                              color="info"
                              size="sm"
                              variant="ghost"
                              onClick={() => onView(row)}
                              title="View"
                            >
                              <FontAwesomeIcon icon={['fas', 'eye']} />
                            </CButton>
                          )}
                          {onEdit && (
                            <CButton
                              color="primary"
                              size="sm"
                              variant="ghost"
                              onClick={() => onEdit(row)}
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={['fas', 'pen']} />
                            </CButton>
                          )}
                          {onDelete && (
                            <CButton
                              color="danger"
                              size="sm"
                              variant="ghost"
                              onClick={() => onDelete(row)}
                              title="Delete"
                            >
                              <FontAwesomeIcon icon={['fas', 'trash']} />
                            </CButton>
                          )}
                        </div>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default ReusableTable
