import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const MyPageReview = ({ reviews }) => {
  console.log("현재 리뷰 상태:", reviews); // 리뷰 상태 확인
  console.log("리뷰 개수:", reviews.length); // length 값 확인

  return (
    <div className="flex justify-end ml-20 h-auto  ">
      <div className="bg-white p-6 rounded-lg shadow-md mt-20  w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 select-none">
          내 리뷰
        </h2>
        {reviews.length === 0 ? (
          <div className="mt-6 select-none">작성한 리뷰가 없습니다.</div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="bg-gray-100 p-4 rounded-md">
                <h4 className="text-lg font-semibold flex items-center whitespace-nowrap overflow-x-auto">
                  <Link
                    to={`/product/read/${review.pno}`}
                    className="text-black hover:text-blue-500"
                  >
                    {review.pname || "상품명 없음"}
                  </Link>
                  <span className="mx-4 text-gray-400">|</span>
                  <span className="text-sm text-gray-500">
                    {review.dueDate}
                  </span>
                </h4>
                {/* <p className="text-sm text-gray-500">
                  별점:
                  <span className="pl-1 text-sm text-yellow-300">
                    {`★`.repeat(review.reviewRating)}
                    {`☆`.repeat(5 - review.reviewRating)}
                  </span>
                </p> */}

                {/* 0402 */}

                <p className="text-sm text-gray-500 flex items-center">
                  별점({review.reviewRating}) :
                  <span className="text-sm text-yellow-300 inline-flex pl-1">
                    {[...Array(Math.floor(review.reviewRating))].map((_, i) => (
                      <FaStar key={`full-${i}`} />
                    ))}
                    {review.reviewRating % 1 !== 0 && <FaStarHalfAlt />}
                    {[...Array(Math.floor(5 - review.reviewRating))].map(
                      (_, i) => (
                        <FaRegStar key={`empty-${i}`} />
                      )
                    )}
                  </span>
                </p>
                <p className="text-md">{review.reviewtext}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyPageReview;
