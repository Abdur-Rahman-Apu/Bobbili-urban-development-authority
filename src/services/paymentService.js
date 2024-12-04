import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { baseUrl } from "../utils/api";
import { getCookie } from "../utils/utils";

const handlePaymentRequest = (initialData, finalData, setLoadingPayment) => {
  const token = JSON.parse(getCookie("jwToken"));

  fetch(`${baseUrl}/payment/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    body: JSON.stringify(initialData),
  })
    .then((res) => res.json())
    .then(async (storeResult) => {
      console.log(storeResult, "Store payment");
      if (
        storeResult?.acknowledged &&
        Number(storeResult?.onlinePaymentAmount) === Number(initialData?.amount)
      ) {
        const token = JSON.parse(getCookie("jwToken"));
        // fetch(
        //   `${baseUrl}/request`,
        //   // "http://localhost:5000/initiateJuspayPayment",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       authorization: token,
        //     },
        //     body: JSON.stringify(data),
        //   }
        // )
        //   .then((response) => {
        //     if (!response.ok) {
        //       throw new Error(`Failed to make payment`);
        //     }
        //     return response.json();
        //   })
        //   .then((data) => {
        //     console.log(data, "DATA");
        //     if (data.status === "NEW") {
        //       const url = data.payment_links.web;
        //       window.location.href = url;
        //     } else {
        //       toast.error(data.message);
        //     }
        //     setLoadingPayment(false);
        //   })
        //   .catch((error) => {
        //     setLoadingPayment(false);
        //     console.log(error, "Payment error");
        //     toast.error(error.message);
        //   });

        try {
          const response = await axios.post(
            `${baseUrl}/payment/request`,
            finalData
          );

          console.log(response, "Response of payment request");

          // Redirect to CCAvenue with the encrypted data
          // return;
          window.location.href = response.data.url;

          setLoadingPayment(false);
        } catch (error) {
          setLoadingPayment(false);
          console.error(error);
          toast.error(error?.response?.data?.message);
        }
      } else {
        setLoadingPayment(false);
        toast.error("Failed to make payment");
      }
    })
    .catch((err) => {
      setLoadingPayment(false);
      toast.error("Failed to make payment");
    });
};

const handlePaymentProcess = (
  amount,
  setLoadingPayment,
  applicationData,
  pageName
) => {
  Swal.fire({
    title: "Do you want to pay?",
    showCancelButton: true,
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      // make a order
      console.log(amount, "amount");
      if (amount > 0) {
        setLoadingPayment(true);
        const firstOwnerInfo =
          applicationData?.applicantInfo?.applicantDetails[0];

        const initialData = {
          applicationNo: applicationData?.applicationNo,
          amount,
          billing_name: firstOwnerInfo?.name,
          billing_email: firstOwnerInfo?.email,
          billing_tel: firstOwnerInfo?.phone,
        };

        const finalData = {
          ...initialData,
          page: pageName,
        };

        handlePaymentRequest(initialData, finalData, setLoadingPayment);
      } else {
        toast.error("Please enter a valid amount");
      }
    }
  });
};

export { handlePaymentProcess, handlePaymentRequest };
