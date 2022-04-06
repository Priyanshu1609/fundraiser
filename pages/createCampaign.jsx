import { useContext } from 'react'
import Modal from 'react-modal'
import { useRouter } from 'next/router'

import TransactionLoader from '../components/TransactionLoader'
import { TransactionContext } from '../context/TransactionContext'


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#0a0b0d',
    padding: 0,
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(10, 11, 13, 0.75)',
  },
}

const CreateCampaign = () => {
  const router = useRouter();

  const { formData, setFormData, handleChange } = useContext(TransactionContext)

  const Field = ({ label, value, type, name }) => (
    <div className="flex flex-col space-y-2 w-full">
      <label htmlFor="default" className="text-gray-700 select-none font-medium">{label}</label>
      <input
        type={`${type}`}
        placeholder={`${value}`}
        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full "
        onChange={e => handleChange(e, `${name}`)}
      />
    </div>
  )

  return (
    <div className=''>
      <p className='text-center text-xl font-semibold mt-12'>Create Campaign</p>
      <div className='mx-8 sm:mx-40 md:mx-60 lg:mx-96 mt-8'>
        <div className='flex w-full space-x-3'>
          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="default" className="text-gray-700 select-none font-medium">Campaign Title</label>
            <input
              type="text"
              placeholder='Title'
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full "
              onChange={e => handleChange(e, 'name')}
            />
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="default" className="text-gray-700 select-none font-medium">Required Amount</label>
            <input
              type="number"
              placeholder='100 MATIC'
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full "
              onChange={e => handleChange(e, 'goal')}
            />
          </div>
        </div>
        <div className='mt-4'>

          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="default" className="text-gray-700 select-none font-medium">Description</label>
            <textarea
              type='textarea'
              placeholder='Description'
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full "
              onChange={e => handleChange(e, 'description')}
            />
          </div>
        </div>
        <div className='mt-4'>
          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="default" className="text-gray-700 select-none font-medium">Image</label>
            <input
              type='file'
              placeholder='Image url'
              accept="image/*"
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full "
              onChange={e => handleChange(e, 'image')}
            />
          </div>
        </div>
        <div className="flex justify-center flex-col w-full items-center mt-4">
          <div className="mt-4">
            <button className='text-black text-sm font-semibold border px-4 py-2 rounded-lg hover:text-black hover:border-black  w-72'>Upload Files to IPFS</button>
          </div>
          <div className="mt-4">
            <input type="submit" className="text-black text-sm font-semibold border px-4 py-2 rounded-lg hover:text-black hover:border-black  w-72" />
          </div>
        </div>
      </div>
      <Modal isOpen={!!router.query.loading} style={customStyles}>
        <TransactionLoader />
      </Modal>
    </div>
  )
}

export default CreateCampaign