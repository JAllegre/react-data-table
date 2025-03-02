import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import ReactDataTable from './ReactDataTable';
import dataJson from './data.json';
function App() {
  /////////////////////

  const columns = [
    {
      title: 'First Name', // Optional.
      name: 'firstName', // Required.
      sortable: true, // Optional. default to true. This column can be sorted by clicking the column header
      visible: true, // Optional. default to true. This column is visible
      searchable: true, // Optional. default to true. The research can be done on it
    },
    {
      title: 'Last Name',
      name: 'lastName',
    },
    {
      // Gender column. data value can be male/female/other
      title: 'Gender',
      name: 'gender',
    },
    {
      title: 'Age',
      name: 'age',
    },
    {
      title: 'Display',
      name: 'display',
      sortable: false,
      searchable: false,
      visible: true,
      render: (cellData, rowData) => {
        const displayString = `${rowData.firstName} ${rowData.lastName} (${rowData.age})`;
        return <div>{cellData ? displayString : '-'}</div>;
      },
    },
    {
      title: 'Id',
      name: 'id',
      sortable: false,
      visible: false,
      searchable: false,
    },
  ];

  const options = {
    title: 'User information', // Optional. Title display at the top box of the table. Empty string if missing
    paginationLength: 10, // optional. pagination menu default value. Use the first if missing
    paginationMenu: [10, 25, 50, 100, 10000], // optional. Possible pagination default value. Only present if table is larger that the paginationLength
    sortColumn: 'firstName',
    sortOrder: 'asc',
  };

  // Custom select filters
  const selectFilters = [
    {
      colName: 'gender', // Column by with to filter
      options: [
        { value: '', label: 'All' },
        { value: 'male', label: 'Men' },
        { value: 'female', label: 'Women' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      colName: 'display', // Column by with to filer
      options: [
        { value: '', label: 'All' },
        { value: true, label: 'Displayable' },
        { value: false, label: 'Not Displayable' },
      ],
    },
  ];

  ///////////////
  const data = dataJson;

  return (
    <div>
      <ReactDataTable
        columns={columns}
        data={data}
        options={options}
        selectFilters={selectFilters}
      />
    </div>
  );
}

export default App;
