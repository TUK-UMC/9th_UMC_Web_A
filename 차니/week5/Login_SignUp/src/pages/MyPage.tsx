import { useEffect, useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth.types";
import { getMyInfo } from "../api/auth";

export const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto>([]);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);
      setData(response);
    };
    getData();
  }, []);

  return (
    <div className="h-[calc(100%-90px)] text-white flex flex-col justify-center items-center">
      <h1>{data.data?.name}님 환영합니다.</h1>
      {/* <img src={data?.data.avatar as string} alt={"구글 로고"} /> */}
      <h1>{data.data?.email}</h1>
    </div>
  );
};
