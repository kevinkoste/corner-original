// import postgres pool
import pg from 'pg'

const pool = new pg.Pool({
  // gets keyword postgres env vars as arguments, could also define here
  // PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
})

export default {
  query: (text: string, params?: any[]) => {
    const start: number = Date.now()
    return new Promise<pg.QueryResult<any>>((resolve, reject) => {
      pool.query(text, params)
        .then(res => {
          const duration: number = Date.now() - start
          console.log('executed query', { text, duration, rows: res.rowCount })
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}