import React from "react";
import ReadComponent from "../../components/reservation/ReadComponent";
import { useParams } from "react-router-dom";

const ReservationReadPage = () => {
  const { pno } = useParams();
  return <ReadComponent pno={pno} />;
};

export default ReservationReadPage;
