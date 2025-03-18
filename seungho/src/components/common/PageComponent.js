import React from "react";

const PageComponent = ({ serverData, movePage }) => {
  return (
    <div className="m-6 flex justify-center">
      {console.log(serverData.prevPage)}
      {serverData.prev ? (
        <div
          className="m2
     p-2 w-16 text-center font-bold text-blue-400"
          onClick={() => movePage({ page: serverData.prevPage })}
        >
          prev
        </div>
      ) : (
        <></>
      )}
      {serverData.pageNumList.map((pageNum) => (
        <div
          key={pageNum}
          className={`m-2 p-2 w-1/2 text-center rounded shadow-md text-white
       ${serverData.current === pageNum ? "bg-gray-500" : "bg-blue-400"}`}
          onClick={() => movePage({ page: pageNum })}
        >
          {pageNum}
        </div>
      ))}

      {serverData.next ? (
        <div
          className="m2 p-2 w-16 text-center font-bold text-blue-400"
          onClick={() => movePage({ page: serverData.nextPage })}
        >
          Next
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PageComponent;
