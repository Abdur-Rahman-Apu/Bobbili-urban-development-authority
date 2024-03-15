import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const useGetPageWiseApplication = (searchApplicationName) => {
  const { userInfoFromLocalStorage } = useContext(AuthContext);
  // console.log(searchApplicationName.split(" ").join(""));
  const { data, refetch, isLoading, isError, isSuccess } = useQuery(
    [`all${searchApplicationName.split(" ").join("")}`],
    async () => {
      const query = {
        userId: userInfoFromLocalStorage()._id,
        searchApplicationName,
      };
      const response = await fetch(
        `http://localhost:5000/allPageWiseApplications?data=${JSON.stringify(
          query
        )}`
      );
      return await response.json();
    }
  );

  // console.log(data, "Data");
  return [data, refetch, isLoading, isError, isSuccess];
};

export default useGetPageWiseApplication;
