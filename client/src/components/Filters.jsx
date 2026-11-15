export default function Filters({ filters, setFilters, onSearch }) {
  const set = (key) => (e) => setFilters({ ...filters, [key]: e.target.value });

  return (
    <form
      className="filters"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <input placeholder="Search title or area..." value={filters.q} onChange={set("q")} />
      <input placeholder="City" value={filters.city} onChange={set("city")} />
      <select value={filters.listingType} onChange={set("listingType")}>
        <option value="">Buy / Rent</option>
        <option value="sale">Buy</option>
        <option value="rent">Rent</option>
      </select>
      <select value={filters.type} onChange={set("type")}>
        <option value="">Any type</option>
        <option value="flat">Flat</option>
        <option value="villa">Villa</option>
        <option value="plot">Plot</option>
        <option value="commercial">Commercial</option>
      </select>
      <select value={filters.bedrooms} onChange={set("bedrooms")}>
        <option value="">Bedrooms</option>
        {[1, 2, 3, 4].map((n) => (
          <option key={n} value={n}>
            {n}+ BHK
          </option>
        ))}
      </select>
      <input type="number" placeholder="Min price" value={filters.minPrice} onChange={set("minPrice")} />
      <input type="number" placeholder="Max price" value={filters.maxPrice} onChange={set("maxPrice")} />
      <select value={filters.sort} onChange={set("sort")}>
        <option value="newest">Newest</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
      </select>
      <button className="btn" type="submit">
        Search
      </button>
    </form>
  );
}
