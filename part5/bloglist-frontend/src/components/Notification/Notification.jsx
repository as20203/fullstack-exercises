import './Notification.css'
const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className={message.type === 'info' ? 'notification' : 'error'}>
        {message.text}
      </div>
    )
  }

export default Notification;