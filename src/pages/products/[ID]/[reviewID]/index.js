import { useRouter } from 'next/router';

const ReviewPage = () => {
    const router = useRouter()
    const {ID , reviewID} = router.query
    return (
        <div>
            <h1>the product id is : {ID}</h1>
            <h1>the review id is : {reviewID}</h1>
        </div>
    );
};

export default ReviewPage;
