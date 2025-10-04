import { useState } from "react"

const PricingPage = ({teamId}) => {
    const prices = [
        {id: 'price_1SDlbOAItJGve3RFVaGLbDMO', name: 'Pro Plan', amount: '$10/month'},
        {id: 'price_1SDlbwAItJGve3RFqSGWotSu', name: 'Business Plan', amount: '$30/month'}
    ]

    const [loading, setLoading ]= useState(false);

    const goToCheckout = async(priceId) => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3000/billing/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({teamId, priceId, teamName: 'Dev Team'})
            })
            const data = await res.json();
            if(data.url){
                window.location.href = data.url
            }else {
                console.error('No Checkout URL returned')
            }
        } catch (error) {
            console.error('Checkout Error', error);
        }finally{
         setLoading(false)
        }
    }

    return(
    <div>
        <h1> Choose a plan</h1>
        {prices.map((plan) => (
            <div key={plan.id} style={{marginBottom: '20px'}}>
             <h2>{plan.name}</h2>
             <p>{plan.amount}</p>
             <button onClick={() => goToCheckout(plan.id)} disabled={loading}>
                {loading ? 'Loading': 'Upgrade'}
             </button>
            </div>
        ))}
    </div>
    )
}

export default PricingPage;