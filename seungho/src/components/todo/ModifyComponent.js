import React, { useEffect, useState } from "react";
import { getOne, putOne } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";

const initState = {
  tno: 0,
  title: "",
  writer: "작성자 수정0214",
  dueDate: null,
  complete: false,
};

const ModifyComponent = ({ tno }) => {
  const [todo, setTodo] = useState({ ...initState });
  const [result, setResult] = useState(null);
  const { moveToList, moveToRead } = useCustomMove();
  useEffect(() => {
    getOne(tno).then((data) => {
      console.log(data);
      setTodo(data);
    });
  }, [tno]);

  const handleChangeTodo = (e) => {
    todo[e.target.name] = e.target.value;
    setTodo({ ...todo });
  };
  const handleChangeTodoComplete = (e) => {
    const value = e.target.value;
    todo.complete = value === "Y";
    setTodo({ ...todo });
  };

  const handleClickmodify = () => {
    putOne(todo).then((data) => {
      setResult("Modified");
    });
  };

  const handleClickDelete = () => {
    putOne(todo).then((data) => {
      setResult("Deleted");
    });
  };

  const closeModal = () => {
    if (result === "Deleted") {
      moveToList();
    } else {
      moveToRead(tno);
    }
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {result ? (
        <ResultModal
          title={"처리결과"}
          content={result}
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )}
      <div className="flex justify-center mt-10">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">TNO</div>
          <div className=" w-4/5 p-6 rounded-r border border-solid shadow-md">
            {todo.tno}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">작성자</div>
          <div className=" w-4/5 p-6 rounded-r border border-solid shadow-md">
            {todo.writer}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">제목</div>
          <input
            className=" w-4/5 p-6 rounded-r border border-neutral-300 shadow-md"
            name="tite"
            typeof={"text"}
            value={todo.title}
            onChange={handleChangeTodo}
          ></input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">날짜</div>
          <input
            className=" w-4/5 p-6 rounded-r border border-neutral-300 shadow-md"
            name="tite"
            typeof={"text"}
            value={todo.dueDate}
            onChange={handleChangeTodo}
          ></input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">완료여부</div>
          <select
            className=" w-4/5 p-6 rounded-r border border-neutral-300 shadow-md"
            name="tite"
            typeof={"text"}
            value={todo.complete ? "Y" : "N"}
            onChange={handleChangeTodoComplete}
          >
            <option value="Y">Completed</option>
            <option value="N">NOT YET</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end p-4">
        <button
          type="button"
          className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
          onClick={handleClickDelete}
        >
          삭제
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
          onClick={handleClickmodify}
        >
          수정
        </button>
      </div>
    </div>
  );
};
export default ModifyComponent;
