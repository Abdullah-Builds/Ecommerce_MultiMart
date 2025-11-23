import Select from 'react-select';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { category } from '../api/index';

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#0f3460",
    color: "white",
    borderRadius: "5px",
    border: "none",
    boxShadow: "none",
    width: "200px",
    height: "40px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#0f3460" : "white",
    color: state.isSelected ? "white" : "#0f3460",
    "&:hover": {
      backgroundColor: "#0f3460",
      color: "white",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
};

const FilterSelect = ({onCategoryChange}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const { data } = await category.getAllCategories({
          signal: controller.signal,
        });

        console.log("API response:", data);

        // data is already an array (based on the log you sent)
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            value: item.category_id,
            label: item.category_name,
          }));

          setCategories(mapped);
        }
      } catch (err) {
        if (!axios.isCancel(err)) console.error(err);
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <Select
      options={categories}
      placeholder="Filter By Category"
      styles={customStyles}
      isClearable
       onChange={(selectedOption) => {
       onCategoryChange(selectedOption ? selectedOption.value : null);
  }}
    />
  );
};

export default FilterSelect;
