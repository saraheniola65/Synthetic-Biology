;; Collaborative Design Contract

(define-map design-projects
  uint
  {
    owner: principal,
    name: (string-ascii 100),
    description: (string-utf8 1000),
    status: (string-ascii 20),
    collaborators: (list 10 principal)
  }
)

(define-data-var last-project-id uint u0)

(define-public (create-project (name (string-ascii 100)) (description (string-utf8 1000)))
  (let
    (
      (project-id (+ (var-get last-project-id) u1))
    )
    (map-set design-projects project-id
      {
        owner: tx-sender,
        name: name,
        description: description,
        status: "active",
        collaborators: (list tx-sender)
      }
    )
    (var-set last-project-id project-id)
    (ok project-id)
  )
)

(define-public (add-collaborator (project-id uint) (collaborator principal))
  (let
    (
      (project (unwrap! (map-get? design-projects project-id) (err u404)))
    )
    (asserts! (is-eq (get owner project) tx-sender) (err u403))
    (asserts! (< (len (get collaborators project)) u10) (err u401))
    (ok (map-set design-projects project-id
      (merge project { collaborators: (unwrap! (as-max-len? (append (get collaborators project) collaborator) u10) (err u401)) })
    ))
  )
)

(define-public (update-project-status (project-id uint) (new-status (string-ascii 20)))
  (let
    (
      (project (unwrap! (map-get? design-projects project-id) (err u404)))
    )
    (asserts! (is-eq (get owner project) tx-sender) (err u403))
    (ok (map-set design-projects project-id
      (merge project { status: new-status })
    ))
  )
)

(define-read-only (get-project (project-id uint))
  (map-get? design-projects project-id)
)

