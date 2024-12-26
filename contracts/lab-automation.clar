;; Lab Automation Integration Contract

(define-map experiments
  uint
  {
    construct-id: uint,
    researcher: principal,
    protocol: (string-utf8 10000),
    status: (string-ascii 20),
    results: (optional (string-utf8 10000))
  }
)

(define-data-var last-experiment-id uint u0)

(define-public (create-experiment (construct-id uint) (protocol (string-utf8 10000)))
  (let
    (
      (experiment-id (+ (var-get last-experiment-id) u1))
    )
    (map-set experiments experiment-id
      {
        construct-id: construct-id,
        researcher: tx-sender,
        protocol: protocol,
        status: "pending",
        results: none
      }
    )
    (var-set last-experiment-id experiment-id)
    (ok experiment-id)
  )
)

(define-public (update-experiment-status (experiment-id uint) (new-status (string-ascii 20)))
  (let
    (
      (experiment (unwrap! (map-get? experiments experiment-id) (err u404)))
    )
    (asserts! (is-eq (get researcher experiment) tx-sender) (err u403))
    (ok (map-set experiments experiment-id
      (merge experiment { status: new-status })
    ))
  )
)

(define-public (submit-experiment-results (experiment-id uint) (results (string-utf8 10000)))
  (let
    (
      (experiment (unwrap! (map-get? experiments experiment-id) (err u404)))
    )
    (asserts! (is-eq (get researcher experiment) tx-sender) (err u403))
    (ok (map-set experiments experiment-id
      (merge experiment { results: (some results), status: "completed" })
    ))
  )
)

(define-read-only (get-experiment (experiment-id uint))
  (map-get? experiments experiment-id)
)

