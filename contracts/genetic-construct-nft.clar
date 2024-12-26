;; Genetic Construct NFT Contract

(define-non-fungible-token genetic-construct uint)

(define-data-var last-token-id uint u0)

(define-map construct-data
  uint
  {
    creator: principal,
    name: (string-ascii 100),
    description: (string-utf8 1000),
    sequence: (string-ascii 10000),
    verified: bool
  }
)

(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-public (create-genetic-construct (name (string-ascii 100)) (description (string-utf8 1000)) (sequence (string-ascii 10000)))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (try! (nft-mint? genetic-construct token-id tx-sender))
    (map-set construct-data token-id
      {
        creator: tx-sender,
        name: name,
        description: description,
        sequence: sequence,
        verified: false
      }
    )
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

(define-read-only (get-construct-data (token-id uint))
  (map-get? construct-data token-id)
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u403))
    (nft-transfer? genetic-construct token-id sender recipient)
  )
)

