import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { baseUrl } from "../../utils/api";

const useGetPageWiseApplication = (searchApplicationName) => {
  const { userInfoFromCookie } = useContext(AuthContext);
  // console.log(searchApplicationName.split(" ").join(""));
  const { data, refetch, isLoading, isError, isSuccess } = useQuery(
    [`all${searchApplicationName.split(" ").join("")}`],
    async () => {
      const query = {
        userId: userInfoFromCookie()._id,
        searchApplicationName,
      };
      const response = await fetch(
        `${baseUrl}/apps/pageWise?data=${JSON.stringify(query)}`
      );
      return await response.json();
    }
  );

  // console.log(data, "Data");
  return [data, refetch, isLoading, isError, isSuccess];
};

export default useGetPageWiseApplication;
