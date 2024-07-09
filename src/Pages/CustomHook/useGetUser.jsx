import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { baseUrl } from "../../utils/api";

const useGetUser = () => {
  const { userInfoFromCookie } = useContext(AuthContext);

  // console.log(userInfoFromCookie()?.userId);

  const { data, refetch, isLoading, isError, isSuccess } = useQuery(
    [`specificUserInfo`],
    async () => {
      const response = await fetch(
        `${baseUrl}/user/allInfoByUserId?userId=${userInfoFromCookie()?.userId}`
      );
      return await response.json();
    }
  );

  // console.log(data, "Data");

  return [data, refetch, isLoading, isError, isSuccess];
};

export default useGetUser;
