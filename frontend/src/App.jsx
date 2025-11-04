import { useEffect, useState } from 'react'
import './App.css'

function App() {
  
  

  return (
    <>
      <main>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </main>
    </>
  )
}

export default App
