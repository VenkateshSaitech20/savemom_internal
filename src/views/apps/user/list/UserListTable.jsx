'use client'
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';
import { rankItem } from '@tanstack/match-sorter-utils';
import PropTypes from "prop-types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table';
import AddUserDrawer from './AddUserDrawer';
import TextFieldStyled from '@core/components/mui/TextField';
import TablePaginationComponent from '@components/TablePaginationComponent';
import { getLocalizedUrl } from '@/utils/i18n';
import tableStyles from '@core/styles/table.module.css';
import Loader from '@/components/loader';
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog';
import { pageList, responseData } from '@/utils/message';
import apiClient from '@/utils/apiClient';
import { signOut } from 'next-auth/react';

const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  return itemRank.passed
}
const userRoleObj = {
  admin: { icon: 'bx-crown', color: 'error' },
  author: { icon: 'bx-desktop', color: 'warning' },
  editor: { icon: 'bx-edit', color: 'info' },
  manager: { icon: 'bx-pie-chart-alt', color: 'success' },
  subscriber: { icon: 'bx-user', color: 'primary' }
}
const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const UserListTable = ({ manageUsersPermission }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(Number(pageList[0].value));
  const [totalPages, setTotalPages] = useState();

  const handleDelete = async userId => {
    setUserIdToDelete(userId);
    setOpen(true);
  };

  const getProfiles = useCallback(async () => {
    setIsLoading(true);
    const response = await apiClient.post("/api/sub-user/get-by-users-id", {
      searchText,
      page: currentPage,
      pageSize
    });
    if (response.data.result === true) {
      setData(response.data.message);
      setFilteredData(response.data.message)
      setTotalPages(response.data.totalPages);
      setIsLoading(false);
    } else if (response.data.result === false) {
      if (response?.data?.message?.roleError?.name === responseData.tokenExpired || response?.data?.message?.invalidToken === responseData.invalidToken) {
        await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
        sessionStorage.removeItem("token");
      }
    }
  }, [searchText, currentPage, pageSize]);

  const handleConfirmation = async (confirmed) => {
    setIsLoading(true);
    if (confirmed) {
      const response = await apiClient.post('/api/sub-user/delete', { userId: userIdToDelete });
      if (response.data.result === true) {
        await getProfiles();
        setOpen(false);
      } else if (response.data.result === false) {
        if (response?.data?.message?.roleError?.name === responseData.tokenExpired || response?.data?.message?.invalidToken === responseData.invalidToken) {
          await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
          sessionStorage.removeItem("token");
        }
      }
    };
    setIsLoading(false);
    setUserIdToDelete(null);
  };

  const handleViewProfile = (id) => {
    const url = getLocalizedUrl(`/apps/user/view/${id}`, locale)
    router.push(url);
  };

  const getUserRole = async () => {
    const response = await apiClient.post('/api/user-role/get-roles-by-user-id', {})
    if (response.data.result === true) {
      setUserRoles(response.data.message)
    } else if (response.data.result === false) {
      if (response?.data?.message?.roleError?.name === responseData.tokenExpired || response?.data?.message?.invalidToken === responseData.invalidToken) {
        await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
        sessionStorage.removeItem("token");
      }
    }
  };

  useEffect(() => {
    getUserRole();
  }, [])

  useEffect(() => {
    getProfiles()
  }, [getProfiles]);

  const { lang: locale } = useParams()

  const columns = useMemo(() => {
    const canDelete = manageUsersPermission?.deletePermission === 'Y';
    const canEdit = manageUsersPermission?.editPermission === 'Y';

    const baseColumns = [
      columnHelper.accessor('name', {
        header: 'User',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography variant='h6'>{row.original.name}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Icon />
            <Typography className='capitalize' color='text.primary'>
              {row.original.roleName}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              label={row.original.profileStatus}
              size='small'
              className='capitalize'
            />
          </div>
        )
      })
    ];

    if (canDelete || canEdit) {
      baseColumns.push(
        columnHelper.accessor('action', {
          header: 'Action',
          cell: ({ row }) => (
            <div className='flex items-center'>
              {canDelete && (
                <IconButton onClick={() => handleDelete(row.original.id)}>
                  <i className='bx-trash text-textSecondary text-[22px]' />
                </IconButton>
              )}
              {canEdit && (
                <IconButton onClick={() => handleViewProfile(row.original.id)}>
                  <i className='bx-show text-textSecondary text-[22px]' />
                </IconButton>
              )}
            </div>
          ),
          enableSorting: false
        })
      );
    }

    return baseColumns;
  }, [data, filteredData, manageUsersPermission]);

  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount: totalPages,
    manualPagination: true,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: pageSize
      }
    },
    onPaginationChange: ({ pageSize, pageIndex }) => {
      setPageSize(pageSize);
      setCurrentPage(pageIndex + 1);
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const handleUserAdded = async () => {
    await getProfiles();
  };

  const handleSearchTextChange = (e) => {
    const text = e.target.value;
    setGlobalFilter(e.target.value);
    if (text.length >= 3 || text.length == 0) {
      setSearchText(text)
    }
  };

  return (
    <>
      <Card>
        <CardHeader title='Filters' className='pbe-4' />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <TextFieldStyled
            select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className='page-drop-size'
            InputLabelProps={{ shrink: true }}
            variant='filled'
          >
            {pageList?.map(item => (
              <MenuItem key={item.value} value={item.value}>{item.value}</MenuItem>
            ))}
          </TextFieldStyled>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <TextFieldStyled
              value={globalFilter ?? ''}
              onChange={handleSearchTextChange}
              placeholder='Search User'
              className='max-sm:is-full min-is-[220px]'
              InputLabelProps={{ shrink: true }}
              variant='filled'
            />
            {/* <Button
              color='secondary'
              variant='tonal'
              startIcon={<i className='bx-export' />}
              className='max-sm:is-full'
            >
              Export
            </Button> */}
            {manageUsersPermission && manageUsersPermission?.writePermission === "Y" && (<Button
              variant='contained'
              startIcon={<i className='bx-plus' />}
              onClick={() => setAddUserOpen(!addUserOpen)}
              className='max-sm:is-full'
            >
              Add New User
            </Button>)}
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='bx-chevron-up text-xl' />,
                            desc: <i className='bx-chevron-down text-xl' />
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length ?? 0} className='text-center'>
                    {isLoading ? <Loader /> : 'No data available'}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel()
                  .rows.slice(0, pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePaginationComponent
          table={table}
          totalPages={totalPages}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <ConfirmationDialog open={open} setOpen={setOpen} type='delete-user' onConfirm={handleConfirmation} />
      </Card>
      <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        onUserAdded={handleUserAdded}
      />
    </>
  )
}

UserListTable.propTypes = {
  manageUsersPermission: PropTypes.any,
}

export default UserListTable
