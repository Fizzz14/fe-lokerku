// card buat ngerapihin aja
function Card({ children, className = '' }) {
  return <div className={`soft-card rounded-xl p-5 ${className}`}>{children}</div>
}

export default Card
