import React from "react";
import "./SearchSection.css"
interface SearchSectionProps{
  searchText:string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}
export default function SearchSection({searchText,setSearchText}:SearchSectionProps){
  function handleKeyDown(e:React.KeyboardEvent<HTMLInputElement>){
    if(e.key === "Enter"){
      setSearchText(e.currentTarget.value);
    }
  }
  return(
    <div className="search-wrapper">
      <input
      value={searchText}
      onChange={(e)=>{setSearchText(e.target.value)}}
      onKeyDown={handleKeyDown}
       className="search-input" type="text" placeholder="Search for movies, actors, directors..." />
    </div >
  );
}