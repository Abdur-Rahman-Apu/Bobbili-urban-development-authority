function DocumentFooter({
  approvedConfirmation,
  setApprovedConfirmation,
  recommendationMessage,
  setRecommendationMessage,
}) {
  const handleMessage = (event) => {
    setRecommendationMessage(event?.target?.value);
  };
  const handleConfirm = (event) => {
    const value = event.target.value;

    value === "approved" && setApprovedConfirmation("true");
    value === "shortfall" && setApprovedConfirmation("false");
  };

  console.log(approvedConfirmation, "Approved confirmation");
  return (
    <div className="nm_Container p-7 font-roboto">
      <p className="text-center font-bold text-[22px] mb-5">
        Submit Your Final Decision
      </p>

      {/* Approved Buttons */}
      <div className="radio-button-container my-4">
        <div className="radio-button">
          <input
            type="radio"
            id="finalApproved"
            name="finalDecision"
            className="radio-button__input"
            value="approved"
            checked={approvedConfirmation === "true"}
            onChange={(event) => handleConfirm(event)}
          />
          <label
            className="radio-button__label text-base"
            htmlFor="finalApproved"
          >
            <span className="radio-button__custom"></span>
            Approve
          </label>
        </div>
        <div className="radio-button">
          <input
            type="radio"
            id="finalShortfall"
            className="radio-button__input"
            name="finalDecision"
            value="shortfall"
            checked={approvedConfirmation === "false"}
            onChange={(event) => handleConfirm(event)}
          />
          <label
            className="radio-button__label text-base"
            htmlFor="finalShortfall"
          >
            <span className="radio-button__custom"></span>
            Shortfall
          </label>
        </div>
      </div>

      {/* Recomendation */}
      <div className="mt-4">
        <label
          htmlFor="recomendation"
          className="block mb-1 font-semibold text-lg text-black"
        >
          Recommendation
        </label>
        <textarea
          id="recomendation"
          name="recomendation"
          rows={6}
          className="w-full md:w-3/4 px-3 py-2 border rounded-lg  border-gray-300 text-black bg-gray-50 focus:border-gray-400 focus:outline-none focus:ring-2 ring-gray-200"
          defaultValue={recommendationMessage && recommendationMessage}
          placeholder="Recommendation"
          onChange={(event) => handleMessage(event)}
        ></textarea>
      </div>
    </div>
  );
}

export default DocumentFooter;
