FROM gcr.io/cloud-builders/gcloud
COPY kubectl.bash /builder/kubectl.bash
RUN curl -o /tmp/kubectl https://storage.googleapis.com/kubernetes-release/release/v1.10.8/bin/linux/amd64/kubectl
RUN chmod +x /tmp/kubectl
RUN mv /tmp/kubectl /builder/kubectl
ENTRYPOINT ["/builder/kubectl.bash"]