function ArchiveLinkBtns({ handleFilter, currentFilter }: { handleFilter: (filter: string) => void, currentFilter: string }) {
  // currentFilterには親コンポーネントの現在のfilterのvalueが入っている

  return (
    
      <div className="archive__link-btns u-flex-btw">
          { currentFilter !== 'all' &&
          <button onClick={() => handleFilter('all')}>All Project<span className="c-arrow-long"></span></button>
          } 
          { currentFilter !== 'active' &&
          <button onClick={() => handleFilter('active')}>Active Project<span className="c-arrow-long"></span></button>
          } 
          { currentFilter !== 'completed' &&
          <button onClick={() => handleFilter('completed')}>Finished Project<span className="c-arrow-long"></span></button>
          }
      </div>

  )
}

export default ArchiveLinkBtns
