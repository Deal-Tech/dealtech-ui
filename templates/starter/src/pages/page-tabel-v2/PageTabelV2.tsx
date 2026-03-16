import { useState } from 'react';
import PageHeader from '../../components/ui/pageheader/PageHeader';
import TableDataV2 from '../../components/ui/tabledata-v2/TableDataV2';
import SearchInput from '../../components/ui/searchinput/SearchInput';
import FilterSelect from '../../components/ui/filterselect/FilterSelect';

const PageTabelV2 = () => {
  const [search, setSearch] = useState('');
  const [satuanFilter, setSatuanFilter] = useState('');

  return (
    <section className="space-y-4">
      <PageHeader
        title="Page Tabel V2"
        subtitle="Contoh tabel editable gaya blok biaya operasional demo."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <SearchInput
          placeholder="Cari item biaya..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <FilterSelect
          allLabel="Semua Satuan"
          options={['paket', 'unit']}
          value={satuanFilter}
          onChange={(event) => setSatuanFilter(event.target.value)}
        />
      </div>

      <TableDataV2 searchValue={search} satuanFilter={satuanFilter} />
    </section>
  );
};

export default PageTabelV2;
