import React from "react";
import { InputGroup, Input, Icon } from "../signup/styles";

const ProfileInputs = ({ formData, onChange }) => {
  return (
    <>
      <InputGroup>
        <Icon className="bx bxs-user" />
        <Input
          type="text"
          name="userName"
          placeholder="이름을 입력해주세요"
          value={formData.userName}
          onChange={onChange}
          style={{ paddingLeft: "1rem" }}
        />
      </InputGroup>

      <InputGroup>
        <Icon className="bx bxs-map" />
        <Input
          type="text"
          name="userAddress"
          placeholder="주소를 입력해주세요"
          value={formData.userAddress}
          onChange={onChange}
          style={{ paddingLeft: "1rem" }}
        />
      </InputGroup>
    </>
  );
};

export default ProfileInputs;