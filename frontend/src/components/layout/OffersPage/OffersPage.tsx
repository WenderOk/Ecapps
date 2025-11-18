import { useState, useEffect } from "react";
import Card from "../../ui/Card/Card.tsx";
import { apiService, type Business } from "../../services/api";

const OffersPage = () => {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBusinesses();
    }, []);

    const loadBusinesses = async () => {
        try {
            const data = await apiService.getDiscounts();
            setBusinesses(data);
        } catch (error) {
            console.error("Error loading businesses:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Загрузка предложений...</div>;

    return (
        <>
            {businesses.map((business) => (
                <Card
                    key={business.id}
                    title={business.company_name}
                    address={`${business.discount_percentage}% скидка`}
                    image="https://picsum.photos/300/200"
                />
            ))}
        </>
    );
};

export default OffersPage;
