import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const useGetUser = () => {
  const { userInfoFromLocalStorage } = useContext(AuthContext);

  // console.log(userInfoFromLocalStorage()?.userId);

  const { data, refetch, isLoading, isError, isSuccess } = useQuery(
    [`specificUserInfo`],
    async () => {
      const response = await fetch(
        `https://residential-building.onrender.com/userInformation?id=${
          userInfoFromLocalStorage()?.userId
        }`
      );
      return await response.json();
    }
  );

  // console.log(data, "Data");

  return [data, refetch, isLoading, isError, isSuccess];
};

export default useGetUser;
